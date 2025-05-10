import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../database-service/database-service.service';

@Component({
  selector: 'app-table-selector',
  imports: [FormsModule, CommonModule],
  templateUrl: './table-selector.component.html',
  styleUrl: './table-selector.component.css',
  standalone: true,
})
export class TableSelectorComponent {
  @Input({ required: true }) tableType: string = "";
  @Input() seletedTable: string = "";
  tables: string[] = ["a","B"];
  @Input() getTableNamesByTypeURL = "";
  @Output() tableSelected = new EventEmitter<string>();
  @Input({ required: true }) token: string = "";

  constructor(private databaseServ: DatabaseService) {}

  ngOnInit() {

    this.fetchTables();
  }
  
  fetchTables(): void {
    this.databaseServ.getTables(this.getTableNamesByTypeURL, this.tableType, this.token).subscribe((response) => {
      this.tables = response.TableNames;
    });
    }
  
  
  TableSelection(): void {
    this.tableSelected.emit(this.seletedTable);
  }
}
