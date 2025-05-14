import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OrderBy } from '../Interfaces/order-by';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-by',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './order-by.component.html',
  styleUrl: './order-by.component.css'
})
export class OrderByComponent implements OnChanges {
  @Input() orderBies: OrderBy[] = []
  @Input() columns: string[] = []
  @Output() updateOrderBy = new EventEmitter<OrderBy[]>
  orderByCount=0
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderBy'] && this.orderBies) {
      this.orderByCount = this.orderBies.length > 0
        ? Math.max(...this.orderBies.map(orderBies => orderBies.id)) + 1
        : 0;
    }
  }
  addOrderBy() {
    const newOrderBy: OrderBy = {
      id: this.orderByCount++,
      field: '',
      sort: -1
    };
    const updateOrderBy = [...this.orderBies, newOrderBy]
    this.orderBies = updateOrderBy
    this.updateOrderBy.emit(this.orderBies);
  }
  onOrderByChange() {
    this.updateOrderBy.emit(this.orderBies);
  }
  removeOrderBy(Id: number) {
    const filteredOrderBy = this.orderBies.filter(item => {
      item.id != Id
    })
    this.orderByCount = filteredOrderBy.length;
    const updatedorderBy = filteredOrderBy.map((OrderBy, index) => ({
      ...OrderBy,
      id: index
    }));
    this.orderByCount = updatedorderBy.length;
    this.orderBies = updatedorderBy;
    this.updateOrderBy.emit(this.orderBies);

  }
}
