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
import { DashboardControlComponent } from '../dashboard-control/dashboard-control.component';
import { MultiStepFormComponent } from '../multi-step-form/multi-step-form.component';
import { RequestToEdit } from '../Interfaces/request-to-edit';

@Component({
  selector: 'app-chart-generator',
  imports: [ChartCreatorFormComponent, CommonModule, MatGridListModule, GridViewComponent, DashboardControlComponent, MultiStepFormComponent],
  templateUrl: './chart-generator.component.html',
  styleUrl: './chart-generator.component.css',
  standalone: true,
})
export class ChartGeneratorComponent implements OnInit {

  @Input({ required: true }) getTableNamesByTypeURL = "";
  @Input({ required: true }) getColumnURL = "";
  @Input({ required: true }) getDataURL = "";
  @Input({ required: true }) tableType = "";
  dataSource: SavedVisualizationData[]=[]
  savedVisualizations: VisualizationResource[] = [];
  unSavedVisualizations: VisualizationResource[]=[]
  @Input() openForm = false;
  @Input() isShowMode = true;
  @Input() dashboardID: string = ""
  @Input() dashboardName: string = "";
  @Input() clusterCode: string = ""
  @Input() propertyCode: string = ""
  @Input() dashboarScope: string = ""

 isCreeateChartClicked = false;

  VisualizationRequestData: Map<string, RequestData> = new Map();
  @Input({ required: true }) token: string="";

  chartToEdit!: RequestToEdit
  @Input() isEditChart: boolean = false;
  constructor(private databaseServ: DatabaseService, private storageService: StorageService) {}
    ngOnInit(): void {
      this.loadSavedVisualization();
  }

  loadSavedVisualization() {
   // this.databaseServ.getSavedCharts()
    //const savedCharts = this.storageService.loadSavedCharts();
    //if (savedCharts.length > 0) {
    //  console.log(savedCharts.length)
    // savedCharts.forEach(chart => {
    //    this.VisualizationRequestData.set(chart.id, chart.requestData);
    //    this.fetchDataForSavedVisualization(chart)
    //  })
    //}

    //if (this.dataSource.length > 0) {
    //
    //  this.dataSource.forEach(Data => {
    //    this.chartRequestData.set(Data.id, Data.requestData);
    //    this.fetchDataForSavedVisualization(Data)
    //  })
    //}
    this.unSavedVisualizations = [...this.savedVisualizations]
  }
  fetchDataForSavedVisualization(chart: SavedVisualizationData) {
  //  const requestData = chart.requestData;
  //  //const requestParams = this.buildHttpParams(requestData);

  //  let Data: any

  //  this.databaseServ.postData(this.getDataURL, requestData, this.token).subscribe(data => {
  //    this.addChartWithData(
  //      chart.id,
  //      data.Data,
  //      chart.chartType,
  //      chart.numberOfRows,
  //      chart.numberOfColumns,
  //      chart.tilte,
  //      chart.x,
  //      chart.y
  //    );
  //  });
  //  console.log(Data)

    
  }
  addChart(id: any, chartType: string, rows: number, cols: number, Tilte: string, requestData: RequestData, data?: any[],x?: number, y?: number): void {
    const newChart: VisualizationResource = {
      Id: id,
      data: data,
      type: chartType,
      numberOfRows: rows,
      numberOfColumns: cols,
      title: Tilte,
      x: x,
      y: y,
      requestData: requestData
    };
    this.unSavedVisualizations = [...this.unSavedVisualizations, newChart]
  }


  //  this.Visualizations = [...this.Visualizations, newChart];
  //}

  //buildHttpParams(requestData: any): HttpParams {
  //  let params = new HttpParams();

  //  Object.entries(requestData).forEach(([key, values]) => {
  //    if (Array.isArray(values)) {
  //      values.forEach(value => {
  //        if (value !== undefined && value !== null) {
  //          params = params.append(key, String(value)); 
  //        }
  //      });
  //    } else if (values !== undefined && values !== null) {
  //      params = params.append(key, String(values));
  //    }
  //  });

  //  return params;
  //}
  fetchData(request: any) {
    console.log("Received from child:", request);
    const requestData = request.dataRequste;
    //const requestParams = this.buildHttpParams(requestData);

    this.VisualizationRequestData.set(request.Id, requestData);

   // console.log(request.dataRequste)
   
    this.databaseServ.postData(this.getDataURL, requestData, this.token).subscribe(data => {
      this.addChart(
        request.Id,
        data.Data,
        request.chartType,
        request.NumberOfRows,
        request.NumberOfColumns,
        request.Title,
        requestData
      );
    //  this.saveVisualizations();
    });
  }
  saveVisualizations(): void {
    console.log(this.savedVisualizations);
    //this.storageService.saveVisualization(this.Visualizations, this.VisualizationRequestData);
  }

  
  removeChart(chartId: string): void {
    //this.Visualizations = this.Visualizations.filter(chart => chart.Id !== chartId);
    //this.VisualizationRequestData.delete(chartId);
    //this.saveVisualizations();
  }

  openChartModalClicked() {
    this.openForm = true;

    setTimeout(() => this.openForm = false, 0);
  }

  handleChangeMode(mode: boolean)
  {
    this.isShowMode = mode
    this.isCreeateChartClicked = false
    console.log("saved", this.savedVisualizations)
    this.unSavedVisualizations = [... this.savedVisualizations]
    console.log("us", this.unSavedVisualizations)

  }

  handleCreateChart(isCreateChart: boolean) {
    this.isCreeateChartClicked = isCreateChart
  }
  handleCloseCreateChartForm() {
    this.isCreeateChartClicked = false
  }
  createChartClick() {
    this.isCreeateChartClicked = true

  }
  handleAddNewVisualization(request: any) {
    const data: any = [];
    this.addChart(request.Id,
      request.chartType,
      request.numberOfRows,
      request.numberOfColumns,
      request.tilte,
      request.dataRequste,
      data)
  }
  
  handleEditExistChart(request: any) {
    const index = this.unSavedVisualizations.findIndex(v => v.Id === request.Id);
    if (index !== -1) {
      const existChart = this.unSavedVisualizations[index];
    
      const updatedChart = {
        ...existChart,
        title: request.tilte || request.title,
        numberOfRows: request.numberOfRows,
        numberOfColumns: request.numberOfColumns,
        type: request.chartType,
        x: request.x,
        y: request.y,
        requestData: request.dataRequste,
        data: request.dataRequste ? [] : existChart.data
      };

      this.unSavedVisualizations = [
        ...this.unSavedVisualizations.slice(0, index),
        updatedChart,
        ...this.unSavedVisualizations.slice(index + 1)
      ];
      console.log('Updated chart:', updatedChart);
      console.log(this.unSavedVisualizations)
    }
  }
  handelEditClicked(Edit: RequestToEdit) {
    this.chartToEdit = Edit
    this.isCreeateChartClicked = true
  
  }
}
