export interface ChartResources {
  Id: any
  Data: any[]
  ChartType: string
  ChartSize: string
  NumberOfRows: Number
  NumberOfColumns: Number
  x?: number;  // Added for gridster positioning
  y?: number;
}
