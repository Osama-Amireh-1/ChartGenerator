import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType as ChartJSChartType } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements AfterViewInit {
  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) chartType: string = '';
  @Input({ required: true }) title: string = '';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx || !this.data || this.data.length === 0) return;

    const type: ChartJSChartType = (this.chartType.toLowerCase() as ChartJSChartType) || 'bar';

    const { labels, datasets } = this.extractChartData(this.data);

    const styledDatasets = datasets.map((dataset, index) => {
      const color = this.generateColors(1, 0.7)[0];
      return {
        ...dataset,
        backgroundColor: type === 'pie' ?
          this.generateColors(labels.length, 0.7) :
          color,
        borderColor: type === 'line' ? color : undefined,
        fill: type === 'line' ? false : undefined,
        tension: type === 'line' ? 0.1 : undefined
      };
    });

    let finalDatasets = styledDatasets;
    if ((type === 'pie') && styledDatasets.length > 1) {
      finalDatasets = [styledDatasets[0]];
      finalDatasets[0].backgroundColor = this.generateColors(labels.length, 0.7);
    }

    const chartData: any = {
      labels: labels,
      datasets: finalDatasets
    };

    const options: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: this.title,
        }
      }
    };

    if (type !== 'pie') {
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

    console.log('Chart data:', this.data);
    this.destroyChart();
    this.chart = new Chart(ctx, config);
  }


  extractChartData(data: any[]): { labels: any[], datasets: any[] } {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const firstItem = data[0];
    
    if (firstItem.Key && typeof firstItem.Key === 'object') {
      const dataProperties = Object.keys(firstItem).filter(prop => prop !== 'Key');
      
      const labels = data.map(item => {
        const keyObj = item.Key;
        if (!keyObj) return 'Unknown';
        
        const keyValues = Object.values(keyObj);
        return keyValues.join('-');
      });
      
      const datasets = dataProperties.map(property => {
        return {
          label: property,
          data: data.map(item => {
            if (item.hasOwnProperty(property)) {
              return parseFloat(item[property]) || 0;
            }
            return 0;
          })
        };
      });
      
      return { labels, datasets };
    }
    
    else {
      const columnNames = Object.keys(firstItem);
      const labelColumn = columnNames[0]; 
      const dataColumns = columnNames.slice(1);
      
      const labels = data.map(item => {
        const labelValue = item[labelColumn];
        if (typeof labelValue === 'object' && labelValue !== null) {
          return Object.values(labelValue).join('-');
        }
        return labelValue;
      });
      
      const datasets = dataColumns.map(column => {
        return {
          label: column,
          data: data.map(item => parseFloat(item[column]) || 0)
        };
      });
      
      return { labels, datasets };
    }
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
