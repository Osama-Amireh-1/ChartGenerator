import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Aggregate } from '../Interfaces/Aggregate';

@Component({
  selector: 'app-form-actions',
  imports: [CommonModule],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.css'
})
export class FormActionsComponent<TPayload = void> {
  //@Input() currentStep=0
  //@Output() prevStepClicked = new EventEmitter<void>();
  //@Output() nextStepClicked = new EventEmitter<void>();
  //@Output() excuteQureyClicked = new EventEmitter<void>();
  //@Input() selectedTableSize = 0;
  //@Input() groupBySize = 0;
  //@Input() aggregateFunctionsSize = 0;
  //@Input() aggregates: Aggregate[] = [];
  //@Input() titleSize = 0
  //@Input() selectedVisualizationTypeSize = 0
  //@Input() numberOfRows = 0;
  //@Input() numberOfColumns = 0;
  //prevStep() {
  //  this.prevStepClicked.emit();
  //}
  //nextStep() {
  //  this.nextStepClicked.emit();
  //}
  //excuteQureyButtonClicked() {
  //  this.excuteQureyClicked.emit();
  //}
  //isAllowClick(): boolean {
  //  if (
  //    (this.currentStep == 1 && this.selectedTableSize == 0) ||
  //    (this.currentStep == 3 && this.groupBySize == 0) ||
  //    (this.currentStep == 4 && this.aggregateFunctionsSize == 0) ||
  //    (this.currentStep == 4 && this.aggregateFunctionsSize > 0 && this.checkAggregateFunctionsIsValid())
  //  ) {
  //    return false;
  //  }
  //  return true;
  //}
  //checkAggregateFunctionsIsValid(): boolean {
  //  for (const item of this.aggregates) {
  //    if (item.aggregateFunction === "" || item.field === "") {
  //      return true;
  //    }
  //  }
  //  return false;
  //}

  @Output() saveClicked = new EventEmitter<void>()

  savedBtnClicked() {
    this.saveClicked.emit();
  }

}
