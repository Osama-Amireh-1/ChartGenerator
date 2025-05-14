import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { ChartCreatorFormComponent } from '../chart-creator-form/chart-creator-form.component';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { v4 as uuidv4 } from 'uuid';
import { SavedVisualizationData } from '../Interfaces/saved-visualization-data';
import { StorageService } from '../StorgeService/storage-service.service';
import { DatabaseService } from '../database-service/database-service.service';
import { RequestData } from '../Interfaces/request-data';
import { VisualizationResource } from '../Interfaces/visualization-resource';

@Component({
  selector: 'app-chart-generator',
  imports: [ChartCreatorFormComponent, CommonModule, MatGridListModule, GridViewComponent],
  templateUrl: './chart-generator.component.html',
  styleUrl: './chart-generator.component.css',
  standalone: true,
})
export class ChartGeneratorComponent implements OnInit {

  @Input({ required: true }) getTableNamesByTypeURL = "";
  @Input({ required: true }) getColumnURL = "";
  @Input({ required: true }) getDataURL = "";
  @Input({ required: true }) tableType = "";
  @Input() dataSource: SavedVisualizationData[]=[]
  Visualizations: VisualizationResource[] = [];
  openForm = false;
  isShowMode = true;
  VisualizationRequestData: Map<string, RequestData> = new Map();
  @Input({ required: true }) token: string="";

  constructor(private databaseServ: DatabaseService, private storageService: StorageService) {}
    ngOnInit(): void {
      this.loadSavedVisualization();
  }

  loadSavedVisualization() {
    const savedCharts = this.storageService.loadSavedCharts();
    if (savedCharts.length > 0) {
      console.log(savedCharts.length)
     savedCharts.forEach(chart => {
        this.VisualizationRequestData.set(chart.id, chart.requestData);
        this.fetchDataForSavedVisualization(chart)
      })
    }

    //if (this.dataSource.length > 0) {
    //
    //  this.dataSource.forEach(Data => {
    //    this.chartRequestData.set(Data.id, Data.requestData);
    //    this.fetchDataForSavedVisualization(Data)
    //  })
    //}

  }
  fetchDataForSavedVisualization(chart: SavedVisualizationData) {
    const requestData = chart.requestData;
    //const requestParams = this.buildHttpParams(requestData);

    let Data: any

    this.databaseServ.postData(this.getDataURL, requestData, this.token).subscribe(data => {
      this.addChartWithData(
        chart.id,
        data.Data,
        chart.chartType,
        chart.numberOfRows,
        chart.numberOfColumns,
        chart.tilte,
        chart.x,
        chart.y
      );
    });
    console.log(Data)

    
  }
  addChartWithData(id: any, data: any[], chartType: string, rows: number, cols: number, Tilte: string, x?: number, y?: number, ): void {
    const newChart: VisualizationResource = {
      Id: id,
      data: data,
      type: chartType,
      numberOfRows: rows,
      numberOfColumns: cols,
      title: Tilte,
      x: x,
      y: y
    };

    this.Visualizations = [...this.Visualizations, newChart];
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
    //const requestParams = this.buildHttpParams(requestData);

    this.VisualizationRequestData.set(request.Id, requestData);

    console.log(request.dataRequste)
   
    this.databaseServ.postData(this.getDataURL, requestData, this.token).subscribe(data => {
      this.addChartWithData(
        request.Id,
        data.Data,
        request.chartType,
        request.NumberOfRows,
        request.NumberOfColumns,
        request.Title,
      );
      this.saveVisualizations();
    });
  }
  saveVisualizations(): void {
    console.log(this.Visualizations);
    this.storageService.saveVisualization(this.Visualizations, this.VisualizationRequestData);
  }

  
  removeChart(chartId: string): void {
    this.Visualizations = this.Visualizations.filter(chart => chart.Id !== chartId);
    this.VisualizationRequestData.delete(chartId);
    this.saveVisualizations();
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
