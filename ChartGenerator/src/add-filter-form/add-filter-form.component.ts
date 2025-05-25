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
  @Input()filters: Filter[] = []
  @Input() parenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() saveFilters = new EventEmitter<Filter[]>();
  @Output() saveFilterParenthesesGroup = new EventEmitter<FilterParenthesesGroup[]>();
  @Input() filterOp: string[] = []
  @Input() columns: string[] = []
  //isAllowToAddNewFilter: boolean = true
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openForm'] && changes['openForm'].currentValue === true) {
      this.openAddFilterForm();
    }
    if (changes['filters']) {
      this.filters = [...changes['filters'].currentValue];
    }

    if (changes['parenthesesGroups']) {
      this.parenthesesGroups = [...changes['parenthesesGroups'].currentValue];
    }
  }
  openAddFilterForm() {

    (window as any).$('#AddFilter').modal('show');

  }
  //handleAddNewFilter() {
  //  this.addNewFilter = true;
  //  setTimeout(() => this.addNewFilter = false, 0);

  //}

  //handleAddNewFilterGroup() {
  //  this.addNewFilterGroup = true
  //  setTimeout(() => this.addNewFilterGroup = false, 0);

  //}
  handleUpdateFilter(filters: Filter[]) {
    this.filters = [...filters];

  }
  //isAllowToAddNewFilter(): boolean {
  //  for (var i = 0; i < this.filters.length; i++) {
  //    if (this.filters[i].field == "" || this.filters[i].operator == "" || this.filters[i].value == "" || this.filters[i].logicalLink == "") {
  //      return false
  //    }
  //  }
  //  return true

  //}
  handleUpdateFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.parenthesesGroups = [...parenthesesGroups];

  }
  handleSaveFilters() {
    this.saveFilters.emit([...this.filters]);
    this.saveFilterParenthesesGroup.emit([...this.parenthesesGroups]);
    (window as any).$('#AddFilter').modal('hide');

  }
  handleCancelFilters() {
    (window as any).$('#AddFilter').modal('hide');
  }
}
