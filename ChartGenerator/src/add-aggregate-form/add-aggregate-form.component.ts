import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AggregateComponent } from '../aggregate/aggregate.component';
import { Aggregate } from '../Interfaces/Aggregate';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { Filter } from '../Interfaces/filter';
import { FilterComponent } from '../filter/filter.component';
import { FilterGroupsComponent } from '../filter-groups/filter-groups.component';
import { FormActionsComponent } from '../form-actions/form-actions.component';

@Component({
  selector: 'app-add-aggregate-form',
  imports: [CommonModule, FormsModule, AggregateComponent, FilterComponent, FilterGroupsComponent, FormActionsComponent],
  templateUrl: './add-aggregate-form.component.html',
  styleUrl: './add-aggregate-form.component.css',
  standalone: true
})
export class AddAggregateFormComponent implements OnChanges {

  @Input() openForm: boolean = false
  @Input() aggregates: Aggregate[] = []
  addNewAggregate: boolean = false
  @Input() aggregateFiltersColumns: string[] = [];
  @Input() aggregateParenthesesGroups: FilterParenthesesGroup[] = [];
  @Input()  aggregateFilters: Filter[] = [];
  havingFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!="]
  @Input() columns: string[]=[]
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openForm'] && changes['openForm'].currentValue === true) {
      this.openAddAggregateForm();
    }
    if (changes['aggregateFilters']) {
      this.aggregateFilters = [...changes['aggregateFilters'].currentValue];
    }

    if (changes['aggregateParenthesesGroups']) {
      this.aggregateParenthesesGroups = [...changes['aggregateParenthesesGroups'].currentValue];
    }
  }
  @Output() saveAggregates = new EventEmitter<Aggregate[]>();
  @Output() saveAggregateFilters = new EventEmitter<Filter[]>();
  @Output() saveAggregateFilterParenthesesGroup = new EventEmitter<FilterParenthesesGroup[]>();
  @Output() saveAggregateFiltersColumns = new EventEmitter<string[]>();

openAddAggregateForm()
{
  (window as any).$('#AddAggregate').modal('show');

  }

  handleAddNewAggregate() {
    this.addNewAggregate = true;
    setTimeout(() => this.addNewAggregate = false, 0);

    
  }
  isAllowToAddNewAggregate(): boolean {
    for (var i = 0; i < this.aggregates.length; i++) {
      if (this.aggregates[i].field == "" || this.aggregates[i].aggregateFunction == "") {
        return false
      }
    }
    return true

  }


handleAddAggregates(Aggregates: Aggregate[]) {
  this.aggregates = Aggregates;

  const aggregateColumns = this.aggregates
    .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
    .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);

  this.aggregateFiltersColumns = aggregateColumns;
//  this.updateOrderByFields();

}
handleRemoveAggregates(Aggregates: Aggregate[]) {
  this.aggregates = Aggregates;

  const aggregateColumns = this.aggregates
    .filter(item => item.aggregateFunction?.toLowerCase().length > 0 && item.field?.length > 0)
    .map(item => `${item.aggregateFunction.toLowerCase()}_${item.field}`);
  this.aggregateFilters = this.aggregateFilters.filter(item =>
    item.field && aggregateColumns.includes(item.field)
  );

  const idMap = new Map<number, number>();
  this.aggregateFilters.forEach((filter, index) => {
    idMap.set(filter.id, index);
    filter.id = index;
  });

  const updatedGroups = this.aggregateParenthesesGroups.map(group => {
    const newFilterIds = group.filterIds
      .filter(fid => idMap.has(fid))
      .map(fid => idMap.get(fid)!);

    return {
      ...group,
      filterIds: newFilterIds
    };
  }).filter(group => group.filterIds.length > 0);

  this.aggregateParenthesesGroups = updatedGroups;
  this.aggregateFiltersColumns = aggregateColumns;

  }
  handleUpdateFilter(filters: Filter[]) {
    this.aggregateFilters = [...filters];

  }
  handleUpdateFilterParentheses(parenthesesGroups: FilterParenthesesGroup[]) {
    this.aggregateParenthesesGroups = [...parenthesesGroups];

  }
  handleSaveAggregate() {
    this.saveAggregates.emit(this.aggregates);
    this.saveAggregateFilters.emit(this.aggregateFilters);
    this.saveAggregateFilterParenthesesGroup.emit(this.aggregateParenthesesGroups);
    this.saveAggregateFiltersColumns.emit(this.aggregateFiltersColumns);
    (window as any).$('#AddAggregate').modal('hide');


  }

  handleCancelAggregate() {
    (window as any).$('#AddAggregate').modal('hide');

  }



}
