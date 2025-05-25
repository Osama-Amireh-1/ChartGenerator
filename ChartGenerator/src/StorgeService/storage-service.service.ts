import { Injectable } from '@angular/core';
import { RequestData } from '../Interfaces/request-data';
import { VisualizationResource } from '../Interfaces/visualization-resource';
import { SavedVisualizationData } from '../Interfaces/saved-visualization-data';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'chart_generator_data';

  constructor() { }

  saveVisualization(charts: VisualizationResource[], formDataMap: Map<string, RequestData>) {

    try {
      const dataToSave: SavedVisualizationData[] = charts.map(chart => {
        return {
          id: chart.Id,
          chartType: chart.type,
          numberOfRows: chart.numberOfRows,
          numberOfColumns: chart.numberOfColumns,
          tilte: chart.title,
          x: chart.x,
          y: chart.y,
          requestData: formDataMap.get(chart.Id) || this.getEmptyRequestData()
        };
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));

    }
    catch (error) {
      console.error('Error saving Visualizations to localStorage:', error);
    }

  }
  loadSavedCharts(): SavedVisualizationData[] {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Error loading Visualizations from localStorage:', error);
      return [];
    }
  }

  private getEmptyRequestData(): RequestData {
    return {
      TableName: '',
      WhereFillters: [],
      WhereFilltersLogicalOperators: [],
      GroupBy: [],
      Aggregates:[],
      AggregateFilter: [],
      AggregateFilterLogicalOperators: [],
      OrderBy: [],
      maxResults:0
    };
  }

}
