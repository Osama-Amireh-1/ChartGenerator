import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { FilterGroupsComponent } from '../filter-groups/filter-groups.component';
import { Filter } from '../Interfaces/filter';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';

@Component({
  selector: 'app-add-filter-form',
  imports: [FilterComponent, FormActionsComponent, FilterGroupsComponent],
  templateUrl: './add-filter-form.component.html',
  styleUrl: './add-filter-form.component.css'
})
export class AddFilterFormComponent implements OnChanges {

  @Input() header = ""
  @Input() openForm!: boolean;
  addNewFilter: boolean = false
  addNewFilterGroup: boolean = false
  filters: Filter[] = []
  parenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() saveFilters = new EventEmitter<Filter[]>();
  @Output() saveFilterParenthesesGroup = new EventEmitter<FilterParenthesesGroup[]>();
  @Input() filterOp: string[] = []
  @Input() columns: string []=[]
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openForm'] && changes['openForm'].currentValue === true) {
      this.openAddFilterForm();
    }
  }
  openAddFilterForm() {

    (window as any).$('#AddFilter').modal('show');

  }
  handleAddNewFilter() {
    this.addNewFilter = true;
    setTimeout(() => this.addNewFilter = false, 0);

  }
  handleAddNewFilterGroup() {
    this.addNewFilterGroup = true
    setTimeout(() => this.addNewFilterGroup = false, 0);

  }
  handleUpdateFilter(filters: Filter[]) {
    this.filters = [...filters];

  }
  handleUpdateFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    console.log("handleUpdateFilterParentheses", this.parenthesesGroups)
    this.parenthesesGroups = [...parenthesesGroups];

  }
  handleSaveFilters() {
    this.saveFilters.emit(this.filters);
    this.saveFilterParenthesesGroup.emit(this.parenthesesGroups);
  }
}
