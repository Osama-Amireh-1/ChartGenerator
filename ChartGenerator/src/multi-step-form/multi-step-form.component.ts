import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableSelectorComponent } from '../table-selector/table-selector.component';
import { FilterParenthesesGroup } from '../Interfaces/filter-parentheses-group';
import { Filter } from '../Interfaces/filter';
import { Aggregate } from '../Interfaces/Aggregate';
import { RequestData } from '../Interfaces/request-data';
import { OrderBy } from '../Interfaces/order-by';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { AddFilterFormComponent } from '../add-filter-form/add-filter-form.component';
import { DatabaseService } from '../database-service/database-service.service';

@Component({
  selector: 'app-multi-step-form',
  imports: [TableSelectorComponent, CommonModule, ProgressBarComponent, AddFilterFormComponent],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.css'
})
export class MultiStepFormComponent {

  seletedTable: string = '';
  columns: string[] = ['a', 'b'];
  tables: string[] = ["a", 'b'];
  groupByFelids: string[] = [];
  @Input() getTableNamesByTypeURL = "";
  @Input() getColumnURL = "";
  @Input() getDataURL = "";
  @Input({ required: true }) tableType = "";
  wherefilters: Filter[] = [];
  aggregateFilters: Filter[] = [];
  whereParenthesesGroups: FilterParenthesesGroup[] = [];
  aggregates: Aggregate[] = [];
  aggregateFiltersColumns: string[] = [];
  aggregateParenthesesGroups: FilterParenthesesGroup[] = [];
  @Output() Execute = new EventEmitter<any>();
  dataRequste!: RequestData;
  logicalFilterLink: string[] = [];
  logicalAggregateLink: string[] = [];
  visualizationType: string = "";
  numberOfRows = 0
  numberOfColumns = 0
  tilte = ""
  @Input() openRequested: boolean = false;
  //groupCount = 0;
  @Input({ required: true }) token: string = "";
  whereFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!=", "STARTSWITH", "CONTAINS", "ENDSWITH"]
  havingFilterOp: string[] = ["=", ">", "<", ">=", "<=", "!="]
  orderBies: OrderBy[] = []
  orderByFeileds: string[] = []
  top: number = 0
  openAddFilter: boolean = false
  constructor(private DatabaseServ: DatabaseService) { }


  fetchColumns(SelectedTable: string) {
    this.seletedTable = SelectedTable;
    console.log("Fetch Columns", this.seletedTable);

    this.DatabaseServ.getColumns(this.getColumnURL, this.seletedTable, this.token).subscribe((response) => {
      this.columns = response.Columns;

    });
  }
  addFilterAndFilterGroupsClicked() {
    console.log(this.openAddFilter)
    this.openAddFilter = true;
    setTimeout(() => this.openAddFilter = false, 0);

  }
  handleSavedWhereFilters(filter: Filter[]) {
    this.wherefilters = filter;
  }
  handleSavedWhereFilterParenthesesGroup(parenthesesGroup: FilterParenthesesGroup[]) {
    this.whereParenthesesGroups = parenthesesGroup

  }
}
