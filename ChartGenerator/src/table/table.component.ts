import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true
})
export class TableComponent {
  @Input({ required: true }) Data: any;
  @Input({ required: true }) title: string=""
  public Object = Object;

  getHeaders(): string[] {
    return this.Data?.length ? Object.keys(this.Data[0]) : [];
  }

  extractValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(', ');
    }
    return String(value);
  }
}
