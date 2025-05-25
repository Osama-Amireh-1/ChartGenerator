import { RequestData } from "./request-data"

export interface VisualizationResource {
  Id: string
  title: string
  data?: any[]
  type: string
  numberOfRows: number
  numberOfColumns: number
  x?: number; 
  y?: number;
  requestData: RequestData;

}
