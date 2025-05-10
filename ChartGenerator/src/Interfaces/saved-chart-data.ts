import { RequestData } from "./request-data";

export interface SavedChartData {
  id: any;
  chartType: string;
  numberOfRows: number;
  numberOfColumns: number;
  x?: number;
  y?: number;
  requestData: RequestData;
  tilte: string
}
