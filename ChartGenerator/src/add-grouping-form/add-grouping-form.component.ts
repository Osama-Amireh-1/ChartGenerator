import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupByComponent } from '../group-by/group-by.component';
import { DragDropComponent } from '../drag-drop/drag-drop.component';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { RequestGroupBy } from '../Interfaces/request-group-by';

@Component({
  selector: 'app-add-grouping-form',
  imports: [CommonModule, FormsModule, GroupByComponent, DragDropComponent, FormActionsComponent],
  templateUrl: './add-grouping-form.component.html',
  styleUrl: './add-grouping-form.component.css'
})
export class AddGroupingFormComponent implements OnChanges {
  @Input() openForm!: boolean;
  @Input() columns: string[]=[]
  addNewGroup: boolean = false
  groupBy: RequestGroupBy[] = [];
  @Input()groupByFields: string[] = []
  @Output() saveGroupByClicked = new EventEmitter<string[]>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openForm'] && changes['openForm'].currentValue === true) {
      this.openAddGroupingForm();
    }
  }
  openAddGroupingForm() {
    (window as any).$('#AddGrouping').modal('show');

  }
  handelUpdateGroupByFields(GroupBy: string[]) {
    this.groupByFields =[...GroupBy]
  }
  handleCancelGroupBy() {
    (window as any).$('#AddGrouping').modal('hide');

  }
  handleSaveGroupBy() {
    this.saveGroupByClicked.emit(this.groupByFields);
      (window as any).$('#AddGrouping').modal('hide');

  }

}
