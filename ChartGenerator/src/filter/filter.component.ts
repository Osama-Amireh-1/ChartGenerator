import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { filter } from 'rxjs';
import { Filter } from '../Interfaces/filter';

@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent  {
  @Input() columns: string[] = [];
  @Input() filters: Filter[] = [];
  @Input() addNewFilter = false
  filterCount = 0;
  @Input() parenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() updateFilters = new EventEmitter<Filter[]>();
  //@Input({ required: true }) header: string = ""
  @Output() updateParenthesesGroups = new EventEmitter<FilterParenthesesGroup[]>();
  @Input() filterOp: string[] = []
  @Input() onlyNumber: boolean = false
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.filterCount = this.filters.length > 0
        ? Math.max(...this.filters.map(f => f.id)) + 1
        : 0;
    }

    if (changes['addNewFilter'] && this.addNewFilter == true) {
      this.addFilter()
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
    this.updateFilters.emit(this.filters);

  }
  //  this.filters.push(newFilter);
  //  this.updateFilters.emit(this.filters);

  //}


  removeFilter(id: number): void {
    const filteredFilters = this.filters.filter(f => f.id !== id);
    const idMap = new Map<number, number>();

    const updatedFilters = filteredFilters.map((filter, index) => {
      idMap.set(filter.id, index);
      return { ...filter, id: index };
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
    });
    console.log("updatedGroups", updatedGroups)

    const finalGroups = updatedFilters.length > 0
      ? [...updatedGroups]
      :[... updatedGroups.filter(g => g.filterIds.length > 0)];

    this.filters = [...updatedFilters];
    this.parenthesesGroups = [...finalGroups];
    console.log("Final", finalGroups)
    console.log("Final2", this.parenthesesGroups)

    this.updateFilters.emit([...this.filters]);
    this.updateParenthesesGroups.emit([...this.parenthesesGroups]);
  }

  isFirstInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    console.log("isFirstInGroup",group.filterIds.length > 0 && filterId === Math.min(...group.filterIds))
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
    this.updateFilters.emit(this.filters);
   
  }
}
