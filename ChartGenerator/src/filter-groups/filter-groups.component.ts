import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { Filter } from '../Interfaces/filter';

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
  @Output() updateFiltersParentheses = new EventEmitter<FilterParenthesesGroup[]>();
  @Input() addNewFilterGroup: boolean = false
  //@Output() upateGroupCount = new EventEmitter<number>(); 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parenthesesGroups'] && this.parenthesesGroups) {
      this.groupCount = this.parenthesesGroups.length > 0
        ? Math.max(...this.parenthesesGroups.map(g => g.id)) + 1
        : 0;
    }
    console.log(this.addNewFilterGroup)
    if (changes['addNewFilterGroup'] && this.addNewFilterGroup==true) {
      this.createGroup()
    }
    if (changes['filters']) {
      this.filters = [...changes['filters'].currentValue];
    }

    if (changes['parenthesesGroups']) {
      this.parenthesesGroups = [...changes['parenthesesGroups'].currentValue];
    }
  }


  createGroup(): void {
    const newGroup: FilterParenthesesGroup = {
      id: this.groupCount++,
      filterIds: []
    };
    this.parenthesesGroups.push(newGroup);
   // this.upateGroupCount.emit(this.groupCount)
  }

  handleCheckboxChange(groupId: number, filterId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleFilterInGroup(groupId, filterId, isChecked);

    this.updateFiltersParentheses.emit([...this.parenthesesGroups])

  }

  toggleFilterInGroup(groupId: number, filterId: number, checked: boolean): void {

    const group = this.parenthesesGroups.find(g => g.id === groupId);
    if (!group) return;
    if (checked) {
      if (!group.filterIds.includes(filterId)) {
        group.filterIds.push(filterId);
        group.filterIds.sort((a, b) => a - b);
        console.log("fiter",group)

      }
    }
    else {
      group.filterIds = group.filterIds.filter(id => id !== filterId);
    }

    //if (group.filterIds.length === 0) {
    //  this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
    //}
  }
  removeGroup(groupId: number): void {
    const originalLength = this.parenthesesGroups.length;

    this.parenthesesGroups = this.parenthesesGroups
      .filter(g => g.id !== groupId)
      .map((group, index) => ({
        ...group,
        id: index
      }));

    if (this.parenthesesGroups.length < originalLength) {
      this.groupCount = this.parenthesesGroups.length;
    }

    this.updateFiltersParentheses.emit([...this.parenthesesGroups])
  }


  isFilterInGroup(groupId: number, filterId: number): boolean {

    const group = this.parenthesesGroups.find(g => g.id === groupId);
    return group ? group.filterIds.includes(filterId) : false;
  }
  handleAddNewFilterGroup() {
    this.createGroup()

  }

}
