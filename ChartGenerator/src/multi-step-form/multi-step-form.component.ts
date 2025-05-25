import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableSelectorComponent } from '../table-selector/table-selector.component';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { Filter } from '../Interfaces/filter';
import { Aggregate } from '../Interfaces/Aggregate';
import { RequestData } from '../Interfaces/request-data';
import { OrderBy } from '../Interfaces/order-by';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { AddFilterFormComponent } from '../add-filter-form/add-filter-form.component';
import { DatabaseService } from '../database-service/database-service.service';
import { AddGroupingFormComponent } from '../add-grouping-form/add-grouping-form.component';
import { AddAggregateFormComponent } from '../add-aggregate-form/add-aggregate-form.component';
import { AddOrderByAndTopFormComponent } from '../add-order-by-and-top-form/add-order-by-and-top-form.component';
import { VisualizationConfig } from '../Interfaces/visualization-config';
import { AddVisualizationDetailsFormComponent } from '../add-visualization-details-form/add-visualization-details-form.component';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { RequestGroupBy } from '../Interfaces/request-group-by';
import { SavedVisualizationData } from '../Interfaces/saved-visualization-data';
import { DataSource } from '@angular/cdk/collections';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-multi-step-form',
  imports: [TableSelectorComponent, CommonModule, ProgressBarComponent, AddFilterFormComponent, AddGroupingFormComponent,
    AddAggregateFormComponent, AddOrderByAndTopFormComponent, AddVisualizationDetailsFormComponent, FormActionsComponent],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.css'
})
export class MultiStepFormComponent {

  seletedTable: string = '';
  columns: string[] = ['a', 'b'];
  tables: string[] = ["a", 'b'];
  groupByFields: string[] = [];
  groubBy: RequestGroupBy[] = [];
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
  //visualizationType: string = "";
  //numberOfRows = 0
  //numberOfColumns = 0
  //tilte = ""
  visualizationDetails: VisualizationConfig = {
    title: "",
    numberOfColumns: 0,
    numberOfRows: 0,
    visualizationType: ""
  }
  @Input() openRequested: boolean = false;
  //groupCount = 0;
  @Input({ required: true }) token: string = "";
  whereFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!=", "STARTSWITH", "CONTAINS", "ENDSWITH"]
  havingFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!="]
  orderBies: OrderBy[] = []
  orderByFeileds: string[] = []
  top: number = 0
  openAddFilter: boolean = false
  isWhereFilterSaved: boolean = false
  openGrouping: boolean = false
  openAgregate: boolean = false
  openOrderBy: boolean = false
  openVisualization: boolean = false
  @Output() isCancelCreateChartClicked = new EventEmitter<void>();
  @Output() addNewVisualization = new EventEmitter <any>()
  constructor(private DatabaseServ: DatabaseService) { }


  fetchColumns(SelectedTable: string) {
    this.seletedTable = SelectedTable;
    console.log("Fetch Columns", this.seletedTable);

    this.DatabaseServ.getColumns(this.getColumnURL, this.seletedTable, this.token).subscribe((response) => {
      this.columns = response.Columns;

    });
  }
  addFilterAndFilterGroupsClicked() {
    this.wherefilters = [...this.wherefilters];
    this.whereParenthesesGroups = [...this.whereParenthesesGroups];
    this.openAddFilter = true;
    setTimeout(() => this.openAddFilter = false, 0);

  }
  handleSavedWhereFilters(filter: Filter[]) {
    this.wherefilters = filter;
    this.isWhereFilterSaved = true;

  }
  handleSavedWhereFilterParenthesesGroup(parenthesesGroup: FilterParenthesesGroup[]) {
    this.whereParenthesesGroups = parenthesesGroup

  }
  isFirstInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.min(...group.filterIds);

  }


  isLastInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.max(...group.filterIds);
  }
  openGroupingForm() {
    this.openGrouping = true
    setTimeout(() => this.openGrouping = false, 0);

  }
  handleSavedGroupBy(groupByFelids: string[]) {
    this.groupByFields =[...groupByFelids]
  }
  openaAgregateForm() {
    this.openAgregate = true
    setTimeout(() => this.openAgregate = false, 0);
  }

  handleSavedAggregates(Aggreagte: Aggregate[]) {
    this.aggregates = [...Aggreagte]

  }
  handleSavedAggregatesFiltersColumns(AggregateColumns: string[]) {
    this.aggregateFiltersColumns = [...AggregateColumns]
  }
  handleSavedAggregatesFiltersParentheses(AggregateFiltersParentheses: FilterParenthesesGroup[]) {
    this.aggregateParenthesesGroups = [...AggregateFiltersParentheses]
    console.log(this.aggregateParenthesesGroups)
  }
  handleSavedAggregatesFilters(AggregateFilters: Filter[]) {
    this.aggregateFilters = [...AggregateFilters]
  }

  openaOrderByForm() {
    this.orderByFeileds = [...this.groupByFields,...this.aggregateFiltersColumns]
    this.openOrderBy = true
    setTimeout(() => this.openOrderBy = false, 0);
  }
  handleSavedOrderBy(orderBy: OrderBy[]) {
    this.orderBies = orderBy
  }
  handleSavedTop(top: number) {
    this.top = top
  }
  openVisualizationForm() {
    this.openVisualization = true
    setTimeout(() => this.openVisualization = false, 0);
  }
  handleSavedVisualizationDetails(details: VisualizationConfig) {
    this.visualizationDetails = details
  }
  prepareRequestData(): void {
    this.dataRequste = {
      TableName: '',
      WhereFillters: [],
      WhereFilltersLogicalOperators: [],
      GroupBy: [],
      Aggregates: [],
      AggregateFilter: [],
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
        FilterValue: filter.value,
        Index: filter.id

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
          aggregateFunction: agg.aggregateFunction,
          Index: agg.id
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
        FilterValue: filter.value,
        Index: filter.id
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

    this.groupByFields.forEach((Fields, index) => {
      if (Fields) {
        this.dataRequste.GroupBy.push({
          field: Fields,
          Index: index
        })
      }
    })
    this.orderBies.forEach(orderBy => {
      if (orderBy.field && orderBy.sort != undefined) {
        this.dataRequste.OrderBy.push({
          Orderby: orderBy.field,
          SortOrder: orderBy.sort,
          index: orderBy.id
        })

      }
      if (this.top > 0) {
        this.dataRequste.maxResults = this.top;
      }
      else {
        this.dataRequste.maxResults = 0
      }
    });
  }
  handleAddisualizationDetails() {
    this.prepareRequestData();
    this.addNewVisualization.emit({
      Id: uuidv4(),
      tilte: this.visualizationDetails.title,
      chartType: this.visualizationDetails.visualizationType,
      numberOfColumns: this.visualizationDetails.numberOfColumns,
      numberOfRows: this.visualizationDetails.numberOfRows,
      dataRequste: this.dataRequste

    })

  }
  handleCancelvisualizationDetails() {
    this.isCancelCreateChartClicked.emit();
  }

  populateFromRequestData(requestData: any): void {
    this.wherefilters = [];
    this.whereParenthesesGroups = [];
    this.logicalFilterLink = [];
    this.aggregates = [];
    this.aggregateFilters = [];
    this.aggregateParenthesesGroups = [];
    this.logicalAggregateLink = [];
    this.groupByFields = [];
    this.orderBies = [];

    this.seletedTable = requestData.TableName || '';

    if (requestData.WhereFillters && requestData.WhereFillters.length > 0) {
      requestData.WhereFillters.forEach((filter: any) => {
        this.wherefilters.push({
          id: filter.Index,
          field: filter.FilterField,
          operator: filter.FilterOperator,
          value: filter.FilterValue,
          logicalLink: 'AND' 
        });
      });

      if (requestData.WhereFilltersLogicalOperators && requestData.WhereFilltersLogicalOperators.length > 0) {
        this.reconstructParenthesesGroups(
          requestData.WhereFilltersLogicalOperators,
          this.wherefilters,
          this.whereParenthesesGroups
        );
      }
    }

    if (requestData.Aggregates && requestData.Aggregates.length > 0) {
      requestData.Aggregates.forEach((agg: any) => {
        this.aggregates.push({
          id: agg.Index,
          field: agg.aggregateField,
          aggregateFunction: agg.aggregateFunction
        });
      });
    }

    if (requestData.AggregateFilter && requestData.AggregateFilter.length > 0) {
      requestData.AggregateFilter.forEach((filter: any) => {
        this.aggregateFilters.push({
          id: filter.Index,
          field: filter.FilterField,
          operator: filter.FilterOperator,
          value: filter.FilterValue,
          logicalLink: 'AND'
        });
      });

      if (requestData.AggregateFilterLogicalOperators && requestData.AggregateFilterLogicalOperators.length > 0) {
        this.reconstructParenthesesGroups(
          requestData.AggregateFilterLogicalOperators,
          this.aggregateFilters,
          this.aggregateParenthesesGroups
        );
      }
    }

    if (requestData.GroupBy && requestData.GroupBy.length > 0) {
      const sortedGroupBy = requestData.GroupBy.sort((a: any, b: any) => a.Index - b.Index);
      sortedGroupBy.forEach((group: any) => {
        this.groupByFields[group.Index] = group.field;
      });
    }

    if (requestData.OrderBy && requestData.OrderBy.length > 0) {
      requestData.OrderBy.forEach((orderBy: any) => {
        this.orderBies.push({
          id: orderBy.index,
          field: orderBy.Orderby,
          sort: orderBy.SortOrder
        });
      });
    }

    this.top = requestData.maxResults || 0;
  }

  private reconstructParenthesesGroups(
    operators: string[],
    filters: any[],
    parenthesesGroups: any[]
  ): void {
    const stack: number[] = [];
    const groups: Map<number, number[]> = new Map();
    let groupId = 0;
    let filterIndex = 0;

    for (let i = 0; i < operators.length; i++) {
      const op = operators[i];

      if (op === '(') {
        stack.push(groupId);
        groups.set(groupId, []);
        groupId++;
      } else if (op === ')') {
        const currentGroupId = stack.pop();
        if (currentGroupId && groups.has(currentGroupId)) {
          parenthesesGroups.push({
            id: currentGroupId,
            filterIds: [...groups.get(currentGroupId)!]
          });
        }
      } else if (op === 'AND' || op === 'OR') {
        if (filterIndex < filters.length - 1) {
          filters[filterIndex + 1].logicalLink = op;
        }

        if (filterIndex < filters.length) {
          stack.forEach(activeGroupId => {
            if (groups.has(activeGroupId)) {
              groups.get(activeGroupId)!.push(filters[filterIndex].id);
            }
          });
        }

        filterIndex++;

        if (filterIndex < filters.length) {
          stack.forEach(activeGroupId => {
            if (groups.has(activeGroupId)) {
              groups.get(activeGroupId)!.push(filters[filterIndex].id);
            }
          });
        }
      }
    }

    while (stack.length > 0) {
      const currentGroupId = stack.pop();
      if (currentGroupId && groups.has(currentGroupId)) {
        parenthesesGroups.push({
          id: currentGroupId,
          filterIds: [...groups.get(currentGroupId)!]
        });
      }
    }
  }
  restForm() {
    this.wherefilters = [];
    this.whereParenthesesGroups = [];
    this.logicalFilterLink = [];
    this.aggregates = [];
    this.aggregateFilters = [];
    this.aggregateParenthesesGroups = [];
    this.logicalAggregateLink = [];
    this.groupByFields = [];
    this.orderBies = [];
    this.seletedTable =  '';
  }
}


