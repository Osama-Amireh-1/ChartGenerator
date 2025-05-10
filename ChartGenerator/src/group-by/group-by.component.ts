import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group-by',
  imports: [CommonModule],
  templateUrl: './group-by.component.html',
  styleUrl: './group-by.component.css'
})
export class GroupByComponent {
  @Input() groupByFelids: string[] = [];
  @Input() columns: string[] = [];
  @Output() updateGroupBy = new EventEmitter<string[]>();
  changeGroupByFileds(vale: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.groupByFelids.push(vale)
    }
    else {
      this.groupByFelids = this.groupByFelids.filter(g => g !== vale);

    }
    this.updateGroupBy.emit(this.groupByFelids)

  }
}
