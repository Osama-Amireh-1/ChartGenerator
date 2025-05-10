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


    let labels: any[] = [];
    let datasets: any[] = [];


    const firstItem = this.data[0];
    const isComplexStructure = Object.values(firstItem).some(val =>
      typeof val === 'object' && val !== null && !Array.isArray(val));

    if (isComplexStructure) {

      const firstProp = Object.keys(firstItem)[0];
      const labelField = Object.keys(firstItem[firstProp])[0];

      const secondProp = Object.keys(firstItem)[1];
      const dataFields = Object.keys(firstItem[secondProp]);

      labels = this.data.map(item => {
        const labelObj = item[firstProp];
        return labelObj.hasOwnProperty(labelField) ? labelObj[labelField] : Object.values(labelObj)[0];
      });

      datasets = dataFields.map((field, index) => {
        const color = this.generateColors(1, 0.7)[0];
        return {
          label: field,
          data: this.data.map(item => {
            const dataObj = item[secondProp];
            return parseFloat(dataObj[field]) || 0;
          }),
          backgroundColor: type === 'pie' ?
            this.generateColors(this.data.length, 0.7) :
            color,
          borderColor: type === 'line' ? color : undefined,
          fill: type === 'line' ? false : undefined,
          tension: type === 'line' ? 0.1 : undefined
        };
      });
    } else {
      const columnNames = Object.keys(firstItem);
      const labelColumn = columnNames[0];
      const dataColumns = columnNames.filter(col => col !== labelColumn);

      labels = this.data.map(item => item[labelColumn]);

      datasets = dataColumns.map((column, index) => {
        const color = this.generateColors(1, 0.7)[0];
        return {
          label: column,
          data: this.data.map(item => parseFloat(item[column]) || 0),
          backgroundColor: type === 'pie' ?
            this.generateColors(this.data.length, 0.7) :
            color,
          borderColor: type === 'line' ? color : undefined,
          fill: type === 'line' ? false : undefined,
          tension: type === 'line' ? 0.1 : undefined
        };
      });
    }

    let finalDatasets = datasets;
    if ((type === 'pie') && datasets.length > 1) {
      finalDatasets = [datasets[0]];
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
