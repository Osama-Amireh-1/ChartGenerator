import { IRequstData } from "../../chart-creator-form/Interfaces/requst-data";

export interface SavedChartData {
  id: any;
  chartType: string;
  numberOfRows: number;
  numberOfColumns: number;
  x?: number;
  y?: number;
  requestData: IRequstData;
}
