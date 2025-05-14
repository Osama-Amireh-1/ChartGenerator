import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-selector.component.html',
  styleUrl: './top-selector.component.css'
})
export class TopSelectorComponent {
  @Input() top: number = 0;
  @Output() updateTopValue = new EventEmitter<number>
  showInput = false;

  onShowModeChange() {
    this.showInput = !this.showInput
    if (this.showInput == false) {
      this.top = 0
    }
  }

  onTopValueChange() {
 
    this.updateTopValue.emit(this.top);
  }

}
