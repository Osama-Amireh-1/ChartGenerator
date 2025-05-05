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

    
    const labels = this.Data.map((item: { brand: any; }) => item.brand);
    const data = this.Data.map((item: { countCard: any; }) => item.countCard);
    const backgroundColors = this.generateColors(labels.length, 0.7);
    const borderColors = this.generateColors(labels.length, 1);


    const type: ChartJSChartType = (this.ChartType.toLowerCase() as ChartJSChartType) || 'bar';

    let chartData: any;

    if (type === 'pie' || type === 'doughnut') {
      chartData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      };
    } else {
      chartData = {
        labels: labels,
        datasets: [{
          label: 'Car Brands Count',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      };
    }

    const options: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
      }
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

  private generateColors(count: number, alpha: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360 / count) % 360;
      colors.push(`hsla(${hue}, 70%, 60%, ${alpha})`);
    }
    return colors;
  }
}
