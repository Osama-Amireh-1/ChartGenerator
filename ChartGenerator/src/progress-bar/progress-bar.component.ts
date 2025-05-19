import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Aggregate } from '../Interfaces/Aggregate';

@Component({
  selector: 'app-progress-bar',
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input() currentStep!: number;
  @Output() stepClicked = new EventEmitter<number>()
  @Input() progressValue: number | undefined;
  @Input() selectedTableSize = 0;
  @Input() groupBySize = 0;
  @Input() aggregateFunctionsSize = 0;
  @Input() aggregates: Aggregate[] = [];
  @Input() titleSize = 0
  @Input() selectedVisualizationTypeSize = 0
  @Input() numberOfRows = 0;
  @Input() numberOfColumns = 0;
  displayStep(Step: number) {
    if (Step < this.currentStep) {
      this.currentStep = Step
      this.stepClicked.emit(this.currentStep)

    }
   
  }

  isAllowClick(): boolean {
    if ((this.currentStep == 1 && this.selectedTableSize == 0) ||
      (this.currentStep == 3 && this.groupBySize == 0) ||
      (this.currentStep == 4 && this.aggregateFunctionsSize == 0) ||
      (this.currentStep == 4 && this.aggregateFunctionsSize > 0 && this.checkAggregateFunctionsIsValid()))
    {
      return false
    }

    if (this.currentStep == 6 &&(this.titleSize == 0 || this.selectedVisualizationTypeSize == 0 || this.numberOfRows == 0 || this.numberOfColumns == 0)) {
      return false

    }
    return true
  }

  checkAggregateFunctionsIsValid(): boolean {
    for (const item of this.aggregates) {
      if (item.aggregateFunction === "" || item.field === "") {

        return true;
      }
    }
    return false;
  }
}





