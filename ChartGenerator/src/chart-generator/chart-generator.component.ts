import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { DatabaseServiceService } from '../chart-creator-form/database-service.service';
import { ChartCreatorFormComponent } from '../chart-creator-form/chart-creator-form.component';
import { ChartResources } from '../chart/Interface/chart-resources';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../StorgeService/storage-service.service';
import { IRequstData } from '../chart-creator-form/Interfaces/requst-data';
import { SavedChartData } from '../StorgeService/Interface/saved-chart-data';

@Component({
  selector: 'app-chart-generator',
  imports: [ChartCreatorFormComponent, CommonModule, MatGridListModule, GridViewComponent],
  templateUrl: './chart-generator.component.html',
  styleUrl: './chart-generator.component.css',
  standalone: true,
})
export class ChartGeneratorComponent implements OnInit {

  @Input({ required: true }) GetViewsAndTablesURL = "";
  @Input({ required: true }) GetTablesURL = "";
  @Input({ required: true }) GetViewsURL = "";
  @Input({ required: true }) GetColumnURL = "";
  @Input({ required: true }) GetDataURL = "";
  @Input({ required: true }) TableType = "";
  charts: ChartResources[] = [];
  openForm = false;
  isShowMode = true;
  chartRequestData: Map<string, IRequstData> = new Map();

  constructor(private DatabaseServ: DatabaseServiceService, private storageService: StorageService) {}
    ngOnInit(): void {
      this.loadSavedCharts();
  }

  loadSavedCharts() {
    const savedCharts = this.storageService.loadSavedCharts();
    if (savedCharts.length > 0) {
      savedCharts.forEach(chart => {
        this.chartRequestData.set(chart.id, chart.requestData);
        this.fetchDataForSavedChart(chart)
      })
    }

  }
  fetchDataForSavedChart(chart: SavedChartData) {
    const requestData = this.buildHttpParams(chart.requestData);

    const ddata = [
      { brand: "Toyota", countCard: 3 },
      { brand: "Honda", countCard: 3 },
      { brand: "Ford", countCard: 3 },
      { brand: "BMW", countCard: 3 },
      { brand: "Mercedes", countCard: 3 },
      { brand: "Tesla", countCard: 2 },
      { brand: "Nissan", countCard: 2 },
      { brand: "Chevrolet", countCard: 1 }
    ];

    this.addChartWithData(
      chart.id,
      ddata,
      chart.chartType,
      chart.numberOfRows,
      chart.numberOfColumns,
      chart.x,
      chart.y
    );
  }
  addChartWithData(id: any, data: any[], chartType: string, rows: number, cols: number, x?: number, y?: number): void {
    const newChart: ChartResources = {
      Id: id,
      Data: data,
      ChartType: chartType,
      NumberOfRows: rows,
      NumberOfColumns: cols,
      x: x,
      y: y
    };

    this.charts = [...this.charts, newChart];
  }

  buildHttpParams(requestData: any): HttpParams {
    let params = new HttpParams();

    Object.entries(requestData).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach(value => {
          if (value !== undefined && value !== null) {
            params = params.append(key, String(value)); 
          }
        });
      } else if (values !== undefined && values !== null) {
        params = params.append(key, String(values));
      }
    });

    return params;
  }
  fetchData(request: any) {
    console.log("Received from child:", request);
    const requestData = request.dataRequste;
    const requestParams = this.buildHttpParams(requestData);

    this.chartRequestData.set(request.Id, requestData);

    console.log(request.dataRequste)
    const ddata = [
      { brand: "Toyota", countCard: 3 },
      { brand: "Honda", countCard: 3 },
      { brand: "Ford", countCard: 3 },
      { brand: "BMW", countCard: 3 },
      { brand: "Mercedes", countCard: 3 },
      { brand: "Tesla", countCard: 2 },
      { brand: "Nissan", countCard: 2 },
      { brand: "Chevrolet", countCard: 1 }
    ];
    //this.DatabaseServ.getData(this.GetDataURL, requestData).subscribe(data => {
    //  this.charts.push({
    //    Data: data,
    //    ChartType: request.chartType,
    //    ChartSize: request.chartSize
    //  });
    //});

    this.addChartWithData(
      request.Id,
      ddata,
      request.chartType,
      request.NumberOfRows,
      request.NumberOfColumns
    );


    this.saveCharts();

  }
  saveCharts(): void {
    this.storageService.saveCharts(this.charts, this.chartRequestData);
  }
  removeChart(chartId: string): void {
    this.charts = this.charts.filter(chart => chart.Id !== chartId);
    this.chartRequestData.delete(chartId);
    this.saveCharts();
  }

  openChartModalClicked() {
    this.openForm = true;

    setTimeout(() => this.openForm = false, 0);
  }

  changeMode()
  {
    this.isShowMode = !this.isShowMode;
    console.log(this.isShowMode)
  }

}
