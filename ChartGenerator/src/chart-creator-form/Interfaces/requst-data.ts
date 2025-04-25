export interface IRequstData {

  tableName: string,
  filterField: string[],
  filterOperator: string[],
  filterValue: any[],
  logicalFilterLink: string[],
  groupByFields: string[],
  aggregateFields: string [],
  aggregateFunctions: string[],
  filterAggregateFields: string[],
  filterAggregateOperators: string [],
  filterAggregateValues: any [],
  logicalAggregateLink: string[],

  
}
