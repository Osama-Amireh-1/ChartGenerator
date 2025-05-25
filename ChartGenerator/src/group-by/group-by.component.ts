import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-group-by',
  imports: [
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    ],
  templateUrl: './group-by.component.html',
  styleUrl: './group-by.component.css',
  standalone: true,

})
export class GroupByComponent implements OnChanges {
  @Input() groupByFields: string[] = [];
  @Input() columns: string[] = [];
  @Output() updateGroupBy = new EventEmitter<string[]>();
  groupBy = new FormControl<string[]>([]);
  constructor() {
    this.groupBy.valueChanges.subscribe(selectedColumns => {
      if (selectedColumns) {
        this.groupByFields = [...selectedColumns];
        console.log(this.groupByFields);
        this.updateGroupBy.emit(this.groupByFields);

      }
    });
  }
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['groupByFields'] && this.groupByFields) 
      {
        const currentValue = this.groupBy.value || [];
        console.log(this.groupByFields)
        if (!this.arraysEqual(currentValue, this.groupByFields)) {
          this.groupBy.setValue([...this.groupByFields], { emitEvent: false });
        }
      }
    }
  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
 
  //changeGroupByFileds(vale: string, event: Event): void {
  //  const isChecked = (event.target as HTMLInputElement).checked;
  //  if (isChecked) {
  //    this.groupByFelids.push(vale)
  //  }
  //  else {
  //    this.groupByFelids = this.groupByFelids.filter(g => g !== vale);

  //  }
  //  this.updateGroupBy.emit(this.groupByFelids)

  //}
}
