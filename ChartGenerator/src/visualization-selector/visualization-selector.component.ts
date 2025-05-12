import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisualizationConfig } from '../Interfaces/visualization-config';


@Component({
  selector: 'app-visualization-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualization-selector.component.html',
  styleUrl: './visualization-selector.component.css'
})
export class VisualizationSelectorComponent {
  @Input() visualizationType: string = '';
  @Input() numberOfRows = 0
  @Input() numberOfColumns = 0
  @Input() title = "";
  @Output() updateVisualization = new EventEmitter<VisualizationConfig>();

  onVisualizationConfigChange() {
    const visualizationConfig: VisualizationConfig = {
      visualizationType: this.visualizationType,
      numberOfRows: this.numberOfRows,
      numberOfColumns: this.numberOfColumns,
      title: this.title
    }
      

      this.updateVisualization.emit(visualizationConfig)
    }
  }


