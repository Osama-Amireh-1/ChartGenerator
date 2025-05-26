import { SavedVisualizationData } from "./saved-visualization-data"

export interface DashboardInfo {
  Id: string,
  Name: string
  Scope: string
  charts: SavedVisualizationData[]
}
