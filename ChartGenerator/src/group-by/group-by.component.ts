import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group-by',
  imports: [CommonModule],
  templateUrl: './group-by.component.html',
  styleUrl: './group-by.component.css'
})
export class GroupByComponent {
  GroupByFelid: string[] = [];
  @Input() columns: string[] = [];
  @Output() UpdateGroupBy = new EventEmitter<string[]>();
  changeGroupByFiled(vale: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.GroupByFelid.push(vale)
    }
    else {
      this.GroupByFelid = this.GroupByFelid.filter(g => g !== vale);

    }
    this.UpdateGroupBy.emit(this.GroupByFelid)

  }
}
