import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { DatabaseServiceService } from './database-service.service';
import { Filter } from './Interfaces/filter';
import { FilterParenthesesGroup } from './Interfaces/filter-parentheses-group';
declare var $: any; 

@Component({
  selector: 'app-chart-creator-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-creator-form.component.html',
  styleUrl: './chart-creator-form.component.css',
  standalone: true,

})
export class ChartCreatorFormComponent {
  currentStep: number = 1;
  progressValue: number = 0;
  SelectedType: string = "";
  SeletedTable: string = "";
  tables: string[] = [];
  columns: string[] = [];
  @Input() GetViewsAndTablesURL = "";
  @Input() GetTablesURL = "";
  @Input() GetViewsURL = "";
  @Input() GetColumnURL = "";
  @Input() GetDataURL = "";
  filters: Filter[] = [];
  parenthesesGroups: FilterParenthesesGroup[] = [];
  filterCount = 0;
  groupCount = 0;

  constructor(private DatabaseServ: DatabaseServiceService) {
  }

  nextStep(): void {
    if (this.currentStep < 6) {
      this.currentStep++;
      this.updateProgress();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }

  updateProgress(): void {
    this.progressValue = ((this.currentStep - 1) / 5) * 100;
  }

  displayStep(step: number): void {
    this.currentStep = step;
    this.updateProgress();
  }

  openChartModal() {
    $('#chartModal').modal('show');

  }
  fetchTables(): void {
    if (this.SelectedType === "All")
      this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
        this.tables = Tables;
      });
  }
  fetchColumns(): void {
    let CURL = this.GetColumnURL + '/' + this.SeletedTable;
    this.DatabaseServ.getTable(CURL).subscribe((Columns) => {
      this.columns = Columns;
    });
  }

  addFilter(): void {
    const newFilter: Filter = {
      id: this.filterCount++,
      field: '',
      operator: '',
      value: '',
      logicalLink: this.filters.length > 0 ? 'AND' : undefined
    };
    this.filters.push(newFilter);
  }

  removeFilter(id: number): void {
    if (this.filters.length <= 1) {
      alert("Cannot remove the last filter");
      return;
    }

    this.filters = this.filters.filter(f => f.id !== id);

    this.parenthesesGroups.forEach(group => {
      group.filterIds = group.filterIds.filter(fid => fid !== id);
    });
    this.parenthesesGroups = this.parenthesesGroups.filter(g => g.filterIds.length > 0);
  }

  createGroup(): void {
    const newGroup: FilterParenthesesGroup = {
      id: this.groupCount++,
      filterIds: []
    };
    this.parenthesesGroups.push(newGroup);
  }


  isFirstInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return filterId === Math.min(...group.filterIds);
  }

  isLastInGroup(group: FilterParenthesesGroup, filterId: number): boolean {
    return filterId === Math.max(...group.filterIds);
  }
  toggleFilterInGroup(groupId: number, filterId: number, checked: boolean): void {
    const group = this.parenthesesGroups.find(g => g.id === filterId);
    if (!group) return;
    if (checked) {
      if (!group.filterIds.includes(filterId)) {
        group.filterIds.push(filterId);

      }
    }
    else {
      group.filterIds = group.filterIds.filter(id => id !== filterId);
    }

    if (group.filterIds.length === 0) {
      this.parenthesesGroups = this.parenthesesGroups.filter(g => g.id !== groupId);
    }
  }
  
}
