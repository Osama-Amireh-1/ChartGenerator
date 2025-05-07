import { Injectable } from '@angular/core';
import { ChartResources } from '../chart/Interface/chart-resources';
import { IRequstData } from '../chart-creator-form/Interfaces/requst-data';
import { SavedChartData } from './Interface/saved-chart-data';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'chart_generator_data';

  constructor() { }

  saveCharts(charts: ChartResources[], formDataMap: Map<string, IRequstData>) {

    try {
      const dataToSave: SavedChartData[] = charts.map(chart => {
        return {
          id: chart.Id,
          chartType: chart.ChartType,
          numberOfRows: chart.NumberOfRows,
          numberOfColumns: chart.NumberOfColumns,
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

  private getEmptyRequestData(): IRequstData {
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
