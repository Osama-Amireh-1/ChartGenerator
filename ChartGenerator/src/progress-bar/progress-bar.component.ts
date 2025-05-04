import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  displayStep(Step: number) {
    this.currentStep = Step
    this.stepClicked.emit(this.currentStep)
  }

}
