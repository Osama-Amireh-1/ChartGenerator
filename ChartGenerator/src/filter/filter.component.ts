import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Filter } from '../chart-creator-form/Interfaces/filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterParenthesesGroup } from '../chart-creator-form/Interfaces/filter-parentheses-group';
import { filter } from 'rxjs';

@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input() columns: string[] = [];
  filters: Filter[] = [];
  filterCount = 0;
  logicalLink: string[] = [];
  @Input() parenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() UpdateFilters = new EventEmitter<Filter[]>();
  @Input({ required: true }) header: string=""
  addFilter(): void {
    const newFilter: Filter = {
      id: this.filterCount++,
      field: '',
      operator: '',
      value: '',
      logicalLink: this.filters.length > 0 ? 'AND' : "OR"
    };
    this.filters.push(newFilter);
  }


  removeFilter(id: number): void {
   
    this.filters = this.filters.filter(f => f.id !== id);

    this.filters.forEach((filter, index) => {
      filter.id = index;
    });

    this.parenthesesGroups.forEach(group => {
      group.filterIds = group.filterIds
        .filter(fid => fid !== id)
        .map(fid => (fid > id ? fid - 1 : fid));
    });

    this.parenthesesGroups = this.parenthesesGroups.filter(g => g.filterIds.length > 0);
    this.UpdateFilters.emit(this.filters);

  }

  isFirstInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.min(...group.filterIds);
  }

  isLastInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return group.filterIds.length > 0 && filterId === Math.max(...group.filterIds);
  }
  showLeftParenthesis(filterId: number): boolean {
    for (const group of this.parenthesesGroups) {
      if (this.isFirstInGroup(group, filterId)) {
        return true;
      }
    }
    return false;
  }

  showRightParenthesis(filterId: number): boolean {
    for (const group of this.parenthesesGroups) {
      if (this.isLastInGroup(group, filterId)) {
        return true;
      }
    }
    return false;
  }

  OnFilterChange() {
    const valiFilters = this.filters.filter(filter =>
      filter.field && filter.field !== '' &&
      filter.operator && filter.operator !== ''
      && filter.value && filter.value !==''
    );

    if (valiFilters.length > 0) {
      this.UpdateFilters.emit(valiFilters);
    }
  }
}
