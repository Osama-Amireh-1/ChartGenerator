import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
declare var Chart: any;

@Component({
  selector: 'app-chart',
  template: '<canvas #chartCanvas></canvas>',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input({ required: true }) Data: any;
  @Input({ required: true }) ChartType: string = '';
  @Input({ required: true }) ChartSize: string = '';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chart: any;

  ngAfterViewInit(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const defaultData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [1, 2, 3],
          strokeColor: '#36A2EB',
          fillColor: '#9BD0F5',
        },
        {
          label: 'Dataset 2',
          data: [2, 3, 4],
          strokeColor: '#FF6384',
          fillColor: '#FFB1C1',
        }
      ]
    };

    const chartData = defaultData;

    const type = this.ChartType.toLowerCase() || 'bar';

    switch (type) {
      case 'bar':
        this.chart = new Chart(ctx).Bar(chartData);
        break;
      case 'line':
        this.chart = new Chart(ctx).Line(chartData);
        break;
      case 'pie':
        const pieData = chartData.datasets[0].data.map((value: number, index: number) => {
          return {
            value: value,
            color: chartData.datasets[0].strokeColor || '#FF6384',
            highlight: chartData.datasets[0].fillColor || '#FFB1C1',
            label: chartData.labels[index] || `Item ${index}`
          };
        });
        this.chart = new Chart(ctx).Pie(pieData);
        break;
      default:
        console.warn(`Unsupported chart type: ${type}`);
    }
  }
}
