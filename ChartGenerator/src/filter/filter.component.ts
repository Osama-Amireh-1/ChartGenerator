import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
export class FilterComponent implements OnChanges {
  @Input() columns: string[] = [];
  @Input() filters: Filter[] = [];
  filterCount = 0; k: string[] = [];
  @Input() parenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() UpdateFilters = new EventEmitter<Filter[]>();
  @Input({ required: true }) header: string = ""
  @Output() updateParenthesesGroups = new EventEmitter<FilterParenthesesGroup[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.filterCount = this.filters.length > 0
        ? Math.max(...this.filters.map(f => f.id)) + 1
        : 0;
    }
  }
  addFilter(): void {
    const newFilter: Filter = {
      id: this.filterCount++,
      field: '',
      operator: '',
      value: '',
      logicalLink: this.filters.length > 0 ? 'AND' : "OR"
    };
    this.filters.push(newFilter);
    this.UpdateFilters.emit(this.filters);

  }


  removeFilter(id: number): void {
   
  const idMap = new Map<number, number>();
    
    this.filters = this.filters.filter(f => f.id !== id);
    
    this.filters.forEach((filter, index) => {
      idMap.set(filter.id, index);
      filter.id = index;
    });
    
    const updatedGroups = this.parenthesesGroups.map(group => {
      return {
        ...group,
        filterIds: group.filterIds
          .filter(fid => fid !== id)  
          .map(fid => {
           
            return idMap.has(fid) ? idMap.get(fid)! : 
                   fid > id ? fid - 1 : fid;
          })
      };
    }).filter(g => g.filterIds.length > 0);

    this.parenthesesGroups = updatedGroups;
    this.UpdateFilters.emit(this.filters);
    this.updateParenthesesGroups.emit(this.parenthesesGroups);
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
    this.UpdateFilters.emit(this.filters);

   
  }
}
