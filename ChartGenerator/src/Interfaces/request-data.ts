import { RequestAggregate } from "./request-aggregate";
import { RequestFilter } from "./request-filter";

export interface RequestData {
  TableName: string,
  //filterField: string[],
  //filterOperator: string[],
  //filterValue: any[],
  WhereFillters: RequestFilter[],

  WhereFilltersLogicalOperators: string[],
  GroupByFields: string[],
  //aggregateFields: string [],
  //aggregateFunctions: string[],
  Aggregates: RequestAggregate[]
  //filterAggregateFields: string[],
  //filterAggregateOperators: string [],
  //filterAggregateValues: any [],
  AggregateFilter: RequestFilter[],

  AggregateFilterLogicalOperators: string[],

  
}
