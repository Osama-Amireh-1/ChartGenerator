import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { DatabaseServiceService } from './database-service.service';
import { Filter } from './Interfaces/filter';
import { FilterParenthesesGroup } from './Interfaces/filter-parentheses-group';
import { Aggregate } from './Interfaces/Aggregate';
import { IRequstData } from './Interfaces/requst-data';
import { filter } from 'rxjs';
declare var $: any; 

@Component({
  selector: 'app-chart-creator-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-creator-form.component.html',
  styleUrl: './chart-creator-form.component.css',
  standalone: true,
})
export class ChartCreatorFormComponent implements OnInit {
  currentStep: number = 1;
  progressValue: number = 0;
  SelectedType: string = "";
  SeletedTable: string = "";
  tables: string[] = [];
  columns: string[] = ["a", "b"];
  GroupByFelid: string[] = [];
  @Input() GetViewsAndTablesURL = "";
  @Input() GetTablesURL = "";
  @Input() GetViewsURL = "";
  @Input() GetColumnURL = "";
  @Input() GetDataURL = "";
  @Input({ required: true }) TableType = "";
  Wherefilters: Filter[] = [];
  AggregateFilters: Filter[] = [];
  parenthesesGroups: FilterParenthesesGroup[] = [];
  Aggregates: Aggregate[] = [];
  filterCount = 0;
  aggregateFilterCount = 0;
  aggregateParenthesesGroups: FilterParenthesesGroup[] = [];
  aggregateGroupCount = 0;
  groupCount = 0;
  aggregateCount = 0;
  @Output() Execute = new EventEmitter<any>();
  dataRequste!: IRequstData;
  logicalFilterLink: string[] = [];
  logicalAggregateLink: string[] = [];
  ChartType: string = "";
  ChartSize: string = "";
  constructor(private DatabaseServ: DatabaseServiceService) {

  }
  ngOnInit() {
   this.fetchTables();
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
    $('#chartModal').modal('show');

  }
  fetchTables(): void {
    if (this.SelectedType === "All")
      this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
        this.tables = Tables;
      });
    else if (this.SelectedType === "Table") {
      this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
        this.tables = Tables;
      });
    }
    else if (this.SelectedType === "View") {
      this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
        this.tables = Tables;
      });
    }
  }
  fetchColumns(): void {
    const CURL = `${this.GetColumnURL}/${this.SeletedTable}`;
    this.DatabaseServ.getColumns(CURL).subscribe((Columns) => {
      this.columns = Columns;
    });


  }
  addAggregate(): void {
    const newAggregate: Aggregate = {
      id: this.aggregateCount++,
      field: '',
      aggregateFunction: ''
    };
    this.Aggregates.push(newAggregate);
  }
  addFilter(): void {
    const newFilter: Filter = {
      id: this.filterCount++,
      field: '',
      operator: '',
      value: '',
      logicalLink: this.Wherefilters.length > 0 ? 'AND' : "OR"
    };
    this.Wherefilters.push(newFilter);
  }


  removeFilter(id: number): void {
    if (this.Wherefilters.length <= 1) {
      alert("Cannot remove the last filter");
      return;
    }

    this.Wherefilters = this.Wherefilters.filter(f => f.id !== id);

    this.Wherefilters.forEach((filter, index) => {
      filter.id = index;
    });

    this.parenthesesGroups.forEach(group => {
      group.filterIds = group.filterIds
        .filter(fid => fid !== id)
        .map(fid => (fid > id ? fid - 1 : fid));
    });

    this.parenthesesGroups = this.parenthesesGroups.filter(g => g.filterIds.length > 0);
  }

  removeGroup(groupId: number): void {
    this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
  }
  removeAggregateGroup(groupId: number): void {
    this.aggregateParenthesesGroups = this.aggregateParenthesesGroups.filter(g => g.id !== groupId);
  }

  isFilterInGroup(groupId: number, filterId: number): boolean {
    const group = this.parenthesesGroups.find(g => g.id === groupId);
    return group ? group.filterIds.includes(filterId) : false;
  }

  isAggregateFilterInGroup(groupId: number, filterId: number): boolean {
    const group = this.aggregateParenthesesGroups.find(g => g.id === groupId);
    return group ? group.filterIds.includes(filterId) : false;
  }

  createAggregateGroup(): void {
    const newGroup: FilterParenthesesGroup = {
      id: this.aggregateGroupCount++,
      filterIds: []
    };
    this.aggregateParenthesesGroups.push(newGroup);
  }

  createGroup(): void {
    const newGroup: FilterParenthesesGroup = {
      id: this.groupCount++,
      filterIds: []
    };
    this.parenthesesGroups.push(newGroup);
  }


  isFirstInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.min(...group.filterIds);
  }

  isLastInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.max(...group.filterIds);
  }

  toggleFilterInGroup(groupId: number, filterId: number, checked: boolean): void {
    const group = this.parenthesesGroups.find(g => g.id === groupId);
    if (!group) return;
    if (checked) {
      if (!group.filterIds.includes(filterId)) {
        group.filterIds.push(filterId);
      }
    }
    else {
      group.filterIds = group.filterIds.filter(id => id !== filterId);
    }

    if (group.filterIds.length === 0) {
      this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
    }
  }

  toggleAggregateFilterInGroup(groupId: number, filterId: number, checked: boolean): void {
    const group = this.aggregateParenthesesGroups.find(g => g.id === groupId);
    if (!group) return;
    if (checked) {
      if (!group.filterIds.includes(filterId)) {
        group.filterIds.push(filterId);
      }
    }
    else {
      group.filterIds = group.filterIds.filter(id => id !== filterId);
    }

    if (group.filterIds.length === 0) {
      this.aggregateParenthesesGroups = this.aggregateParenthesesGroups.filter(g => g.id !== groupId);
    }
  }

  handleCheckboxChange(groupId: number, filterId: number, event: Event, type: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (type == "Where")
      this.toggleFilterInGroup(groupId, filterId, isChecked);
    else if (type == "Having")
      this.toggleAggregateFilterInGroup(groupId, filterId, isChecked);
  }

  getFilterIds(): number[] {
    return this.Wherefilters.map(f => f.id);
  }

  getGroupIds(): number[] {
    return this.parenthesesGroups.map(g => g.id);
  }
  showLeftParenthesis(filterId: number): boolean {
    for (const group of this.parenthesesGroups) {
      if (this.isFirstInGroup(group, filterId)) {
        return true;
      }
    }
    return false;
  }

  showRightParenthesis(filterId: number): boolean {
    for (const group of this.parenthesesGroups) {
      if (this.isLastInGroup(group, filterId)) {
        return true;
      }
    }
    return false;
  }

  changeGroupByFiled(vale: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.GroupByFelid.push(vale)
    }
    else {
      this.GroupByFelid = this.GroupByFelid.filter(g => g !== vale);

    }
    console.log(this.GroupByFelid.length)

  }

  removeAggregate(id: number): void {
    this.Aggregates = this.Aggregates.filter(f => f.id !== id);

    this.Aggregates.forEach((filter, index) => {
      filter.id = index;
    });
  }

  removeAggregateFilter(id: number): void {

    this.AggregateFilters = this.AggregateFilters.filter(f => f.id !== id);

    this.AggregateFilters.forEach((filter, index) => {
      filter.id = index;
    });

    this.aggregateParenthesesGroups.forEach(group => {
      group.filterIds = group.filterIds
        .filter(fid => fid !== id)
        .map(fid => (fid > id ? fid - 1 : fid));
    });

    this.aggregateParenthesesGroups = this.aggregateParenthesesGroups.filter(g => g.filterIds.length > 0);
  }

  addAggregateFilter(): void {
    const newFilter: Filter = {
      id: this.aggregateFilterCount++,
      field: '',
      operator: '',
      value: '',
      logicalLink: this.Wherefilters.length > 0 ? 'AND' : undefined
    };
    this.AggregateFilters.push(newFilter);
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

        this.parenthesesGroups.forEach(group => {
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
  }

  ExcuteQureyButtonClicked() {
      this.prepareRequestData()
    this.Execute.emit({
      dataRequste: this.dataRequste,
      chartType: this.ChartType,
      chartSize: this.ChartSize
    });
  }
  }

