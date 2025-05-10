import { Injectable } from '@angular/core';
import { RequestData } from '../Interfaces/request-data';
import { VisualizationResource } from '../Interfaces/visualization-resource';
import { SavedChartData } from '../Interfaces/saved-chart-data';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'chart_generator_data';

  constructor() { }

  saveCharts(charts: VisualizationResource[], formDataMap: Map<string, RequestData>) {

    try {
      const dataToSave: SavedChartData[] = charts.map(chart => {
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
      console.error('Error saving charts to localStorage:', error);
    }

  }
  loadSavedCharts(): SavedChartData[] {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Error loading charts from localStorage:', error);
      return [];
    }
  }

  private getEmptyRequestData(): RequestData {
    return {
      tableName: '',
      filterField: [],
      filterOperator: [],
      filterValue: [],
      logicalFilterLink: [],
      groupByFields: [],
      aggregateFields: [],
      aggregateFunctions: [],
      filterAggregateFields: [],
      filterAggregateOperators: [],
      filterAggregateValues: [],
      logicalAggregateLink: []
    };
  }

}
