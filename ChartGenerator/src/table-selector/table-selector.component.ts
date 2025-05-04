import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-selector',
  imports: [FormsModule, CommonModule],
  templateUrl: './table-selector.component.html',
  styleUrl: './table-selector.component.css',
  standalone: true,
})
export class TableSelectorComponent {
  @Input({ required: true }) TableType: string = "";
  SeletedTable: string = "";
  tables: string[] = ["a","B"];
  @Input() GetTablesURL = "";
  columns: string[] = [];
  @Output() tableSelected = new EventEmitter<string>();

  ngOnInit() {

    this.fetchTables();
  }

  fetchTables(): void {
    if (this.TableType === "All") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
    else if (this.TableType === "Table") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
    else if (this.TableType === "View") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
  }
  TableSelection(): void {
    this.tableSelected.emit(this.SeletedTable);
  }
}
