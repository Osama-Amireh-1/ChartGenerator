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
  @Input({ required: true }) Data: any[] = [];
  @Input({ required: true }) title: string = "";

  
  getHeaders(): string[] {
    if (!this.Data || this.Data.length === 0) return [];

    const firstItem = this.Data[0];

    if (firstItem.Key && typeof firstItem.Key === 'object') {
      const keyProperties = Object.keys(firstItem.Key);
      const dataProperties = Object.keys(firstItem).filter(prop => prop !== 'Key');

      return [
        ...keyProperties.map(key => `Key.${ key }`),
        ...dataProperties
      ];
    }

    return Object.keys(firstItem);
  }

 
  extractValue(item: any, key: string): string {
    if (!item) return '';

    if (key.startsWith('Key.')) {
      const keyProperty = key.substring(4);
      if (item.Key && item.Key[keyProperty] !== undefined) {
        const value = item.Key[keyProperty];
        return this.formatValue(value);
      }
      return '';
    }

    const value = item[key];
    return this.formatValue(value);
  }


  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(', ');
    }

    return String(value);
  }
}
