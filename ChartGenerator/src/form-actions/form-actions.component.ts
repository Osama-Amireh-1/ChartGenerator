import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  imports: [CommonModule],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.css'
})
export class FormActionsComponent {
  @Input() currentStep=0
  @Output() prevStepClicked = new EventEmitter<void>();
  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() ExcuteQureyClicked = new EventEmitter<void>();

  prevStep() {
    this.prevStepClicked.emit();
  }
  nextStep() {
    this.nextStepClicked.emit();
  }
  ExcuteQureyButtonClicked() {
    this.ExcuteQureyClicked.emit();
  }
}
