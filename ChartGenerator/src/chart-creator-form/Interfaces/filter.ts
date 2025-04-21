export interface Filter {
  id: number;
  field: string;
  operator: string;
  value: string;
  logicalLink?: string;
}
