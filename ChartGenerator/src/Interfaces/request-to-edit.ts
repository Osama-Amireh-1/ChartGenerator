import { RequestData } from "./request-data"

export interface RequestToEdit {
  Id: string
  RequestData: RequestData
  type: string
  numberOfRows: number
  numberOfColumns: number
  title: string
  x?: number;
  y?: number;
}
