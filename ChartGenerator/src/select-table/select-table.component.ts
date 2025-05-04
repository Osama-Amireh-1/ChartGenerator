import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-table',
  imports: [],
  templateUrl: './select-table.component.html',
  styleUrl: './select-table.component.css'
})
export class SelectTableComponent {
  @Input({ required: true }) SelectedType: string = "";
  SeletedTable: string = "";
  tables: string[] = [];
  @Input() GetColumnURL = "";
  @Input() GetTablesURL = "";
  columns: string[] = ["a", "b"];

  fetchTables(): void {
    if (this.SelectedType === "All") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
    else if (this.SelectedType === "Table") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
    else if (this.SelectedType === "View") {
      //this.DatabaseServ.getTable(this.GetViewsAndTablesURL).subscribe((Tables) => {
      //  this.tables = Tables;
      //});
    }
  }
  fetchColumns(): void {
    const CURL = `${this.GetColumnURL}/${this.SeletedTable}`;
    //this.DatabaseServ.getColumns(CURL).subscribe((Columns) => {
    //  this.columns = Columns;
    //});


  }
}
