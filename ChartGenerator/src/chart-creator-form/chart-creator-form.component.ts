import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { DatabaseServiceService } from './database-service.service';
import { Filter } from './Interfaces/filter';
import { FilterParenthesesGroup } from './Interfaces/filter-parentheses-group';
import { Aggregate } from './Interfaces/Aggregate';
import { IRequstData } from './Interfaces/requst-data';
import { v4 as uuidv4 } from 'uuid';
import { TableSelectorComponent } from '../table-selector/table-selector.component';
import { FilterComponent } from '../filter/filter.component'
import { FilterGroupsComponent } from '../filter-groups/filter-groups.component';
import { GroupByComponent } from '../group-by/group-by.component';
import { AggregateComponent } from '../aggregate/aggregate.component';
import { map, retry } from 'rxjs';
import { ChartConfig } from '../chart-selector/Interface/chart-config';
import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
//declare var $: any; 

@Component({
  selector: 'app-chart-creator-form',
  imports: [CommonModule, FormsModule, TableSelectorComponent, FilterComponent, FilterGroupsComponent, GroupByComponent, AggregateComponent,
    ChartSelectorComponent, FormActionsComponent, ProgressBarComponent],
  templateUrl: './chart-creator-form.component.html',
  styleUrl: './chart-creator-form.component.css',
  standalone: true,
})
export class ChartCreatorFormComponent {
  currentStep: number = 1;
  progressValue: number = 0;
  SeletedTable: string = "";
  columns: string[] = [];
  tables: string[] = ["a",'b'];
  GroupByFelid: string[] = [];
  @Input() GetViewsAndTablesURL = "";
  @Input() GetTablesURL = "";
  @Input() GetViewsURL = "";
  @Input() GetColumnURL = "";
  @Input() GetDataURL = "";
  @Input({ required: true }) TableType = "";
  Wherefilters: Filter[] = [];
  AggregateFilters: Filter[] = [];
  whereParenthesesGroups: FilterParenthesesGroup[] = [];
  Aggregates: Aggregate[] = [];
  AggregateFiltersColumns: string[] = [];
  aggregateParenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() Execute = new EventEmitter<any>();
  dataRequste!: IRequstData;
  logicalFilterLink: string[] = [];
  logicalAggregateLink: string[] = [];
  ChartType: string = "";
  NumberOfRows=0
  NumberOfColumns = 0
  @Input() openRequested: boolean = false;
  groupCount = 0;

  constructor(private DatabaseServ: DatabaseServiceService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['openRequested'] && this.openRequested) {
      this.openChartModal(); 
    }
  }

  nextStep(): void {
    if (this.currentStep < 6) {
      this.currentStep++;
      this.updateProgress();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }

  updateProgress(): void {
    this.progressValue = ((this.currentStep - 1) / 5) * 100;
  }

  displayStep(step: number): void {
    this.currentStep = step;
    this.updateProgress();
  }

  openChartModal() {
    (window as any).$('#chartModal').modal('show');

  }


  prepareRequestData(): void {
    this.dataRequste = {
      tableName: '',
      filterField: [],
      filterOperator: [],
      filterValue: [],
      logicalFilterLink: [],
      groupByFields: [],
      aggregateFields: [],
      aggregateFunctions: [],
      filterAggregateFields: [],
      filterAggregateOperators: [],
      filterAggregateValues: [],
      logicalAggregateLink: [],
  
    };

    const validWhereFilters = this.Wherefilters.filter(
      filter => filter.field && filter.operator && filter.value !== undefined
    );
    validWhereFilters.forEach(filter => {
      this.dataRequste.filterField.push(filter.field);
      this.dataRequste.filterOperator.push(filter.operator);
      this.dataRequste.filterValue.push(filter.value);
    });
    if (validWhereFilters.length > 1) {
      const filterInfo = validWhereFilters.map(filter => {
        const filterId = filter.id;

        let openingGroups: number[] = [];
        let closingGroups: number[] = [];

        this.whereParenthesesGroups.forEach(group => {
          const sortedFilters = [...group.filterIds].sort((a, b) => a - b);
          if (sortedFilters.includes(filterId)) {
            if (sortedFilters[0] === filterId) {
              openingGroups.push(group.id);
            }
            if (sortedFilters[sortedFilters.length - 1] === filterId) {
              closingGroups.push(group.id);
            }
          }
        });

        return {
          filterId,
          openingGroups,
          closingGroups,
          logicalOperator: filter.logicalLink ? filter.logicalLink : "AND"
        };
      });
      if (filterInfo[0].openingGroups.length > 0) {
        filterInfo[0].openingGroups.forEach(() => {
          this.logicalFilterLink.push('(');
        });
      }

      for (let i = 0; i < filterInfo.length - 1; i++) {
        const currentFilter = filterInfo[i];
        const nextFilter = filterInfo[i + 1];

        currentFilter.closingGroups.forEach(() => {
          this.logicalFilterLink.push(')');
        });

        this.logicalFilterLink.push(nextFilter.logicalOperator);

        nextFilter.openingGroups.forEach(() => {
          this.logicalFilterLink.push('(');
        });
      }

      if (filterInfo[filterInfo.length - 1].closingGroups.length > 0) {
        filterInfo[filterInfo.length - 1].closingGroups.forEach(() => {
          this.logicalFilterLink.push(')');
        });
      }

      this.dataRequste.logicalFilterLink = [...this.logicalFilterLink];
    }

    this.Aggregates.forEach(agg => {
      if (agg.aggregateFunction && agg.field) {
        this.dataRequste.aggregateFunctions.push(agg.aggregateFunction);
        this.dataRequste.aggregateFields.push(agg.field);
      }
    });

    const validAggregateFilters = this.AggregateFilters.filter(
      filter => filter.field && filter.operator && filter.value !== undefined
    );

    validAggregateFilters.forEach(filter => {
      this.dataRequste.filterAggregateFields.push(filter.field);
      this.dataRequste.filterAggregateOperators.push(filter.operator);
      this.dataRequste.filterAggregateValues.push(Number(filter.value));
    });


    if (validAggregateFilters.length > 1) {
      const aggregateFilterInfo = validAggregateFilters.map(filter => {
        const filterId = filter.id;

        let openingGroups: number[] = [];
        let closingGroups: number[] = [];

        this.aggregateParenthesesGroups.forEach(group => {
          const sortedFilters = [...group.filterIds].sort((a, b) => a - b);
          if (sortedFilters.includes(filterId)) {
            if (sortedFilters[0] === filterId) {
              openingGroups.push(group.id);
            }
            if (sortedFilters[sortedFilters.length - 1] === filterId) {
              closingGroups.push(group.id);
            }
          }
        });

        return {
          filterId,
          openingGroups,
          closingGroups,
          logicalOperator: filter.logicalLink ? filter.logicalLink : "AND"
        };
      });

   
      if (aggregateFilterInfo[0].openingGroups.length > 0) {
        aggregateFilterInfo[0].openingGroups.forEach(() => {
          this.logicalAggregateLink.push('(');
        });
      }

     
      for (let i = 0; i < aggregateFilterInfo.length - 1; i++) {
        const currentFilter = aggregateFilterInfo[i];
        const nextFilter = aggregateFilterInfo[i + 1];

    
        currentFilter.closingGroups.forEach(() => {
          this.logicalAggregateLink.push(')');
        });

  
        this.logicalAggregateLink.push(nextFilter.logicalOperator);

      
        nextFilter.openingGroups.forEach(() => {
          this.logicalAggregateLink.push('(');
        });
      }

      if (aggregateFilterInfo[aggregateFilterInfo.length - 1].closingGroups.length > 0) {
        aggregateFilterInfo[aggregateFilterInfo.length - 1].closingGroups.forEach(() => {
          this.logicalAggregateLink.push(')');
        });
      }

      this.dataRequste.logicalAggregateLink = [...this.logicalAggregateLink];

      

    }
    this.dataRequste.groupByFields = this.GroupByFelid;
  }

  ExcuteQureyButtonClicked() {
      this.prepareRequestData()
    this.Execute.emit({
      Id: uuidv4(),
      dataRequste: this.dataRequste,
      chartType: this.ChartType,
      NumberOfRows: this.NumberOfRows,
      NumberOfColumns: this.NumberOfColumns
    });

   this.restartForm()


  }
  

  restartForm(): void {
    this.currentStep = 1;
    this.progressValue = 0;
    this.TableType = "";
    this.SeletedTable = "";
    this.tables = [];
    this.columns = ['a', 'b'];
    this.GroupByFelid = [];
    this.Wherefilters = [];
    this.AggregateFilters = [];
    this.Aggregates = [];
    this.whereParenthesesGroups = [];
    this.aggregateParenthesesGroups = [];
    this.logicalFilterLink = [];
    this.logicalAggregateLink = [];
    this.ChartType = "";
    this.NumberOfRows = 0;
    this.NumberOfColumns = 0;
    (window as any).$('#chartModal').modal('hide');

  }
  fetchColumns(SelectedTable: string) {
    this.SeletedTable = SelectedTable;
    console.log("Fetch Columns", this.SeletedTable)
    const CURL = `${this.GetColumnURL}/${this.SeletedTable}`;
    this.columns = ['a', 'b'];

    //this.DatabaseServ.getColumns(CURL).subscribe((Columns) => {
    //  this.columns = Columns;
    //});

  }

  handleUpdateWhereFilter(filters: Filter[]) {
    this.Wherefilters = filters;
  }
  handleUpdateWhereFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.whereParenthesesGroups = parenthesesGroups;
  }
  handleUpdateGroupBy(GroupByFelids: string[]) {
    this.GroupByFelid = GroupByFelids;
  }
  handleAddAggregates(Aggregates: Aggregate[]) {
    this.Aggregates = Aggregates;

    const aggregateColumns = this.Aggregates
      .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
      .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);

    this.AggregateFiltersColumns = aggregateColumns;
  }
  handleRemoveAggregates(Aggregates: Aggregate[]) {
    this.Aggregates = Aggregates;

    const aggregateColumns = this.Aggregates
      .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
      .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);
    this.AggregateFilters = this.AggregateFilters.filter(item =>
      item.field && aggregateColumns.includes(item.field)
    );

    const idMap = new Map<number, number>();
    this.AggregateFilters.forEach((filter, index) => {
      idMap.set(filter.id, index);
      filter.id = index;
    });

    const updatedGroups = this.aggregateParenthesesGroups.map(group => {
      const newFilterIds = group.filterIds
        .filter(fid => idMap.has(fid))
        .map(fid => idMap.get(fid)!);

      return {
        ...group,
        filterIds: newFilterIds
      };
    }).filter(group => group.filterIds.length > 0);

    this.aggregateParenthesesGroups = updatedGroups;
    this.AggregateFiltersColumns = aggregateColumns;

  }
  handleUpdateHavingFilter(filters: Filter[]) {
    this.AggregateFilters = filters
  }
  handleUpdateHavingFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.aggregateParenthesesGroups = parenthesesGroups
  }
  handleChartUpdate(chartConfig: ChartConfig) {
    console.log(chartConfig)
    this.ChartType = chartConfig.ChartType
    this.NumberOfRows = chartConfig.NumberOfRows
    this.NumberOfColumns = chartConfig.NumberOfColumns

  }
  handlegroupCountUpdate(groupCount: number) {
    this.groupCount = groupCount;
  }
}

