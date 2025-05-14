import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { v4 as uuidv4 } from 'uuid';
import { TableSelectorComponent } from '../table-selector/table-selector.component';
import { FilterComponent } from '../filter/filter.component'
import { FilterGroupsComponent } from '../filter-groups/filter-groups.component';
import { GroupByComponent } from '../group-by/group-by.component';
import { AggregateComponent } from '../aggregate/aggregate.component';
import { groupBy, map, retry } from 'rxjs';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { DatabaseService } from '../database-service/database-service.service';
import { Filter } from '../Interfaces/filter';
import { Aggregate } from '../Interfaces/Aggregate';
import { RequestData } from '../Interfaces/request-data';
import { VisualizationConfig } from '../Interfaces/visualization-config';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { VisualizationSelectorComponent } from '../visualization-selector/visualization-selector.component';
import { OrderBy } from '../Interfaces/order-by';
import { OrderByComponent } from '../order-by/order-by.component';
import { TopSelectorComponent } from '../top-selector/top-selector.component';
//declare var $: any; 

@Component({
  selector: 'app-chart-creator-form',
  imports: [CommonModule, FormsModule, TableSelectorComponent, FilterComponent, FilterGroupsComponent, GroupByComponent, AggregateComponent,
    VisualizationSelectorComponent, FormActionsComponent, ProgressBarComponent, OrderByComponent, TopSelectorComponent],
  templateUrl: './chart-creator-form.component.html',
  styleUrl: './chart-creator-form.component.css',
  standalone: true,
})
export class ChartCreatorFormComponent {
  currentStep: number = 1;
  progressValue: number = 0;
  seletedTable: string = "";
  columns: string[] = [];
  tables: string[] = ["a", 'b'];
  groupByFelids: string[] = [];
  @Input() getTableNamesByTypeURL = "";
  @Input() getColumnURL = "";
  @Input() getDataURL = "";
  @Input({ required: true }) tableType = "";
  wherefilters: Filter[] = [];
  aggregateFilters: Filter[] = [];
  whereParenthesesGroups: FilterParenthesesGroup[] = [];
  aggregates: Aggregate[] = [];
  aggregateFiltersColumns: string[] = [];
  aggregateParenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() Execute = new EventEmitter<any>();
  dataRequste!: RequestData;
  logicalFilterLink: string[] = [];
  logicalAggregateLink: string[] = [];
  visualizationType: string = "";
  numberOfRows = 0
  numberOfColumns = 0
  tilte = ""
  @Input() openRequested: boolean = false;
  //groupCount = 0;
  @Input({ required: true }) token: string = "";
  whereFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!=", "STARTSWITH", "CONTAINS","ENDSWITH" ]
  havingFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!="]
  orderBies: OrderBy[] = []
  orderByFeileds: string[] = []
  top: number=0
  constructor(private DatabaseServ: DatabaseService) {

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
      TableName: '',
      WhereFillters:[], 
      WhereFilltersLogicalOperators: [],
      GroupByFields: [],
      Aggregates:[],
      AggregateFilter:[],
      AggregateFilterLogicalOperators: [],
      OrderBy: [],
      maxResults: 0
  
    };
    this.dataRequste.TableName = this.seletedTable
    const validWhereFilters = this.wherefilters.filter(
      filter => filter.field && filter.operator && filter.value !== undefined
    );
    validWhereFilters.forEach(filter => {
      this.dataRequste.WhereFillters.push({
        FilterField: filter.field,
        FilterOperator: filter.operator,
        FilterValue: filter.value

      })
        
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

      this.dataRequste.WhereFilltersLogicalOperators = [...this.logicalFilterLink];
    }

    this.aggregates.forEach(agg => {
      if (agg.aggregateFunction && agg.field) {
        this.dataRequste.Aggregates.push({
          aggregateField: agg.field,
          aggregateFunction:agg.aggregateFunction
        })
      
      }
    });

    const validAggregateFilters = this.aggregateFilters.filter(
      filter => filter.field && filter.operator && filter.value !== undefined
    );

    validAggregateFilters.forEach(filter => {
      this.dataRequste.AggregateFilter.push({
        FilterField: filter.field,
        FilterOperator: filter.operator,
        FilterValue: filter.value
      })

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

      this.dataRequste.AggregateFilterLogicalOperators = [...this.logicalAggregateLink];

      

    }
    this.dataRequste.GroupByFields = this.groupByFelids;
    this.orderBies.forEach(orderBy => {
      if (orderBy.field && orderBy.sort != undefined) {
        this.dataRequste.OrderBy.push({
          Orderby: orderBy.field,
          SortOrder: orderBy.sort
        })

      }
      if (this.top > 0) {
        this.dataRequste.maxResults = this.top;
      }
      else {
        this.dataRequste.maxResults=0
      }
    });
  }

  excuteQureyButtonClicked() {
      this.prepareRequestData()
    this.Execute.emit({
      Id: uuidv4(),
      dataRequste: this.dataRequste,
      chartType: this.visualizationType,
      NumberOfRows: this.numberOfRows,
      NumberOfColumns: this.numberOfColumns,
      Title: this.tilte
    });

   this.restartForm()


  }
  

  restartForm(): void {
    this.currentStep = 1;
    this.progressValue = 0;
    this.seletedTable ="";
    this.tables = [];
    this.columns = ['a', 'b'];
    this.groupByFelids = [];
    this.wherefilters = [];
    this.aggregateFilters = [];
    this.aggregates = [];
    this.whereParenthesesGroups = [];
    this.aggregateParenthesesGroups = [];
    this.logicalFilterLink = [];
    this.logicalAggregateLink = [];
    this.visualizationType = "";
    this.numberOfRows = 0;
    this.numberOfColumns = 0;
    this.tableType = this.tableType;
    this.tilte = "";
    this.top = 0;
    (window as any).$('#chartModal').modal('hide');

  }
  fetchColumns(SelectedTable: string) {
    this.seletedTable = SelectedTable;
    console.log("Fetch Columns", this.seletedTable);

    this.DatabaseServ.getColumns(this.getColumnURL, this.seletedTable, this.token).subscribe((response)=>{
      this.columns = response.Columns;

    });
  }

  handleUpdateWhereFilter(filters: Filter[]) {
    this.wherefilters = filters;
  }
  handleUpdateWhereFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.whereParenthesesGroups = parenthesesGroups;
  }
  handleUpdateGroupBy(GroupByFelids: string[]) {
    this.groupByFelids = GroupByFelids;
    this.updateOrderByFields();

  }
  handleAddAggregates(Aggregates: Aggregate[]) {
    this.aggregates = Aggregates;

    const aggregateColumns = this.aggregates
      .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
      .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);

    this.aggregateFiltersColumns = aggregateColumns;
    this.updateOrderByFields();

  }
  handleRemoveAggregates(Aggregates: Aggregate[]) {
    this.aggregates = Aggregates;

    const aggregateColumns = this.aggregates
      .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
      .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);
    this.aggregateFilters = this.aggregateFilters.filter(item =>
      item.field && aggregateColumns.includes(item.field)
    );

    const idMap = new Map<number, number>();
    this.aggregateFilters.forEach((filter, index) => {
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
    this.aggregateFiltersColumns = aggregateColumns;
    this.updateOrderByFields();

  }
  handleUpdateHavingFilter(filters: Filter[]) {
    this.aggregateFilters = filters
  }
  handleUpdateHavingFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.aggregateParenthesesGroups = parenthesesGroups
  }
  handleVisualizationUpdate(chartConfig: VisualizationConfig) {
    console.log(chartConfig)
    this.visualizationType = chartConfig.visualizationType
    this.numberOfRows = chartConfig.numberOfRows
    this.numberOfColumns = chartConfig.numberOfColumns
    this.tilte = chartConfig.title
    console.log(this.tilte)
  }
  private updateOrderByFields(): void {
    this.orderByFeileds = [...this.groupByFelids, ...this.aggregateFiltersColumns];
  }
  handleUpdateOrderBy(OrderBy: OrderBy[]):void {
    this.orderBies = OrderBy
  }
  handleUpdateTopValue(Top: number) {
    this.top = Top;
  }
  //handlegroupCountUpdate(groupCount: number) {
  //  this.groupCount = groupCount;
  //}
}

