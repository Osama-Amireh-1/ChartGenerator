import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js/auto';
Chart.register(...registerables)
@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  @Input({ required: true }) Data: any;
   data = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 3],
        borderColor: '#36A2EB',
        backgroundColor: '#9BD0F5',
      },
      {
        label: 'Dataset 2',
        data: [2, 3, 4],
        borderColor: '#FF6384',
        backgroundColor: '#FFB1C1',
      }
    ]
  };
  @Input({ required: true }) ChartType: string="";
  @Input({ required: true }) ChartSize: string = "";
   config:any = {
    type: 'bar',
    data: this.data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  chart: any
  ngOnInit():void {
    this.chart = new Chart("Chart", this.config)

  }

}
