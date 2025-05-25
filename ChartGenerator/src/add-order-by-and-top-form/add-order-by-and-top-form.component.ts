import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OrderByComponent } from '../order-by/order-by.component';
import { TopSelectorComponent } from '../top-selector/top-selector.component';
import { OrderBy } from '../Interfaces/order-by';
import { FormActionsComponent } from '../form-actions/form-actions.component';

@Component({
  selector: 'app-add-order-by-and-top-form',
  imports: [OrderByComponent, TopSelectorComponent, FormActionsComponent],
  templateUrl: './add-order-by-and-top-form.component.html',
  styleUrl: './add-order-by-and-top-form.component.css'
})
export class AddOrderByAndTopFormComponent implements OnChanges {

  @Input() openForm = false;
  @Input() columns: string[] = [];
  @Input() top: number = 0;
  @Input() orderBies: OrderBy[] = []
  @Output() saveOrderBy = new EventEmitter<OrderBy[]>();
  @Output() saveTop = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['openForm'] && this.openForm == true) {
      this.openAddOrderByAndTopForm()
    }

  }

  openAddOrderByAndTopForm() {
    (window as any).$('#AddOrderByAndTop').modal('show');

  }
  handleTopValueChange(top: number) {
    this.top=top
  }
  handleOderbyChanged(OrderBy: OrderBy[]) {
    this.orderBies = OrderBy
  }

  handleSaveOrderByAndTop() {
    this.saveOrderBy.emit(this.orderBies);
    this.saveTop.emit(this.top);
    (window as any).$('#AddOrderByAndTop').modal('hide');

  }
  handleCancelOrderByAndTop() {
    (window as any).$('#AddOrderByAndTop').modal('hide');

  }

}
