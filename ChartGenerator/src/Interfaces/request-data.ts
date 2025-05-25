import { OrderBy } from "./order-by";
import { RequestAggregate } from "./request-aggregate";
import { RequestFilter } from "./request-filter";
import { RequestGroupBy } from "./request-group-by";
import { RequestOrderBy } from "./request-order-by";

export interface RequestData {
  TableName: string,
  //filterField: string[],
  //filterOperator: string[],
  //filterValue: any[],
  WhereFillters: RequestFilter[],

  WhereFilltersLogicalOperators: string[],
  GroupBy: RequestGroupBy[],
  //aggregateFields: string [],
  //aggregateFunctions: string[],
  Aggregates: RequestAggregate[]
  //filterAggregateFields: string[],
  //filterAggregateOperators: string [],
  //filterAggregateValues: any [],
  AggregateFilter: RequestFilter[],

  AggregateFilterLogicalOperators: string[],
  OrderBy: RequestOrderBy[]
  maxResults: number

  
}
