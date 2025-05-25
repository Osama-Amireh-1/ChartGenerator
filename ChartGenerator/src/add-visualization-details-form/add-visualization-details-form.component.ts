import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { VisualizationSelectorComponent } from '../visualization-selector/visualization-selector.component';
import { CommonModule } from '@angular/common';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { VisualizationConfig } from '../Interfaces/visualization-config';

@Component({
  selector: 'app-add-visualization-details-form',
  imports: [VisualizationSelectorComponent, CommonModule, FormActionsComponent],
  templateUrl: './add-visualization-details-form.component.html',
  styleUrl: './add-visualization-details-form.component.css',
  standalone: true
})
export class AddVisualizationDetailsFormComponent implements OnChanges {

  @Input() openForm: boolean = false
  @Input() visualizationDetails: VisualizationConfig = {
    title: "",
    numberOfColumns: 0,
    numberOfRows: 0,
    visualizationType:""


  }
  @Output() saveVisualizationDetails = new EventEmitter<VisualizationConfig>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openForm'] && this.openForm == true) {
      this.openVisualizationDetailsForm();

    }
  }
  openVisualizationDetailsForm() {
    (window as any).$('#AddVisualizationDetails').modal('show');

  }
  handleSaveVisualizationDetails() {
    this.saveVisualizationDetails.emit(this.visualizationDetails);
    (window as any).$('#AddVisualizationDetails').modal('hide');

  }
  handleCancelVisualizationDetails() {
    (window as any).$('#AddVisualizationDetails').modal('hide');

  }
  handleVisualizationDetailsChanged(details: VisualizationConfig) {
    this.visualizationDetails = details

  }
}
