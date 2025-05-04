import { Component, EventEmitter, Output } from '@angular/core';
import { ChartConfig } from './Interface/chart-config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chart-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-selector.component.html',
  styleUrl: './chart-selector.component.css'
})
export class ChartSelectorComponent {
  ChartType: string = '';
  NumberOfRows = 0
  NumberOfColumns = 0
  @Output() UpdateChart = new EventEmitter<ChartConfig>();

  OnChartChange() {
    if (this.ChartType && this.ChartType !== '' && this.NumberOfRows > 0 && this.NumberOfColumns > 0) {
      const chartConfig: ChartConfig = {
        ChartType: this.ChartType,
        NumberOfRows: this.NumberOfRows,
        NumberOfColumns: this.NumberOfColumns
      };
      console.log(chartConfig)

      this.UpdateChart.emit(chartConfig)
    }
  }

}
