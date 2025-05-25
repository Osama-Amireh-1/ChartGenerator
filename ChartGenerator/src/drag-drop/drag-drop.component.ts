import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drag-drop',
  imports: [MatButtonModule, MatIconModule, DragDropModule,
],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css'
})
export class DragDropComponent {

  @Input() groupByFields: string[] = []
  @Output() updateGroupByOrder = new EventEmitter<string[]>()


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groupByFields, event.previousIndex, event.currentIndex);
    console.log(this.groupByFields)
    this.updateGroupByOrder.emit(this.groupByFields);

  }

  // Remove a field from selection
  removeField(index: number) {
    this.groupByFields.splice(index, 1);
    this.updateGroupByOrder.emit(this.groupByFields);
  //  this.groupBy.setValue([...this.groupByFelids]);
    // this.updateGroupBy.emit(this.groupByFelids);
  }
}
