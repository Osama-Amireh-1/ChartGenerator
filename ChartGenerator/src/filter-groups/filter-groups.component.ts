import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilterParenthesesGroup } from '../chart-creator-form/Interfaces/filter-parentheses-group';
import { Filter } from '../chart-creator-form/Interfaces/filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-groups',
  imports: [CommonModule, FormsModule,],
  templateUrl: './filter-groups.component.html',
  styleUrl: './filter-groups.component.css'
})
export class FilterGroupsComponent implements OnChanges {

  @Input() parenthesesGroups: FilterParenthesesGroup[] = [];
  @Input() groupCount = 0;
  @Input() filters: Filter[] = [];
  @Output() UpdateFiltersParentheses = new EventEmitter<FilterParenthesesGroup[]>();
  @Output() UpateGroupCount = new EventEmitter<number>(); 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parenthesesGroups'] && this.parenthesesGroups) {
      this.groupCount = this.parenthesesGroups.length > 0
        ? Math.max(...this.parenthesesGroups.map(g => g.id)) + 1
        : 0;
    }
  }


  createGroup(): void {
    const newGroup: FilterParenthesesGroup = {
      id: this.groupCount++,
      filterIds: []
    };
    this.parenthesesGroups.push(newGroup);
    this.UpateGroupCount.emit(this.groupCount)
  }

  handleCheckboxChange(groupId: number, filterId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleFilterInGroup(groupId, filterId, isChecked);

    this.UpdateFiltersParentheses.emit(this.parenthesesGroups)

  }

  toggleFilterInGroup(groupId: number, filterId: number, checked: boolean): void {
    const group = this.parenthesesGroups.find(g => g.id === groupId);
    if (!group) return;
    if (checked) {
      if (!group.filterIds.includes(filterId)) {
        group.filterIds.push(filterId);
        group.filterIds.sort((a, b) => a - b);
      }
    }
    else {
      group.filterIds = group.filterIds.filter(id => id !== filterId);
    }

    if (group.filterIds.length === 0) {
      this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
    }
  }

  removeGroup(groupId: number): void {
    this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
    console.log(this.parenthesesGroups)

    this.UpdateFiltersParentheses.emit(this.parenthesesGroups)

  }


  isFilterInGroup(groupId: number, filterId: number): boolean {
    const group = this.parenthesesGroups.find(g => g.id === groupId);
    return group ? group.filterIds.includes(filterId) : false;
  }

}
