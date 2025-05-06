import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { DatabaseServiceService } from '../chart-creator-form/database-service.service';
import { ChartCreatorFormComponent } from '../chart-creator-form/chart-creator-form.component';
import { ChartResources } from '../chart/Interface/chart-resources';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chart-generator',
  imports: [ChartCreatorFormComponent, CommonModule, MatGridListModule, GridViewComponent],
  templateUrl: './chart-generator.component.html',
  styleUrl: './chart-generator.component.css',
  standalone: true,
})
export class ChartGeneratorComponent {

  @Input({ required: true }) GetViewsAndTablesURL = "";
  @Input({ required: true }) GetTablesURL = "";
  @Input({ required: true }) GetViewsURL = "";
  @Input({ required: true }) GetColumnURL = "";
  @Input({ required: true }) GetDataURL = "";
  @Input({ required: true }) TableType = "";
  charts: ChartResources[] = [];
  openForm = false;
  isShowMode = true;
  constructor(private DatabaseServ: DatabaseServiceService) {

    
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
    const requestData = this.buildHttpParams(request.dataRequste);
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

    const newChart = {
      Id: uuidv4(),
      Data: ddata,
      ChartType: request.chartType,
      NumberOfRows: request.NumberOfRows,
      NumberOfColumns: request.NumberOfColumns
    };

    this.charts = [...this.charts, newChart];

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
