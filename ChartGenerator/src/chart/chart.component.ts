import {Component,Input,ViewChild,ElementRef,AfterViewInit} from '@angular/core';

import {Chart,registerables,ChartConfiguration,ChartType as ChartJSChartType} from 'chart.js';

Chart.register(...registerables); 

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: `./chart.component.css`
})
export class ChartComponent implements AfterViewInit {
  @Input({ required: true }) Data: any;
  @Input({ required: true }) ChartType: string = '';
  @Input({ required: true }) ChartSize: string = '';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }



  createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [1, 2, 3],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Dataset 2',
          data: [2, 3, 4],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    const chartData = this.Data ? defaultData :{
      labels: this.Data.map((item: { label: any; }) => item.label),
      datasets: [
        {
          label: 'Your Dataset',
          data: this.Data.map((item: { value: any; }) => item.value),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    }  
    const type: ChartJSChartType = (this.ChartType.toLowerCase() as ChartJSChartType) || 'bar';

    const options: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false
    };

    if (type !== 'pie' && type !== 'doughnut') {
      options.scales = {
        y: {
          beginAtZero: true
        }
      };
    }

    const config: ChartConfiguration = {
     
      type: type,
      data: chartData,
      options: options
    };
    console.log(this.Data)
    this.chart = new Chart(ctx, config);
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  public resizeChart(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }
}
