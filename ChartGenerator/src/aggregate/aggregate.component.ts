import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Aggregate } from '../chart-creator-form/Interfaces/Aggregate';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aggregate',
  imports: [CommonModule, FormsModule],
  templateUrl: './aggregate.component.html',
  styleUrl: './aggregate.component.css'
})
export class AggregateComponent {
  aggregateCount = 0;
  Aggregates: Aggregate[] = [];
  @Input() columns: string[] = [];
  @Output() UpdateAggregates = new EventEmitter<Aggregate[]>();



  addAggregate(): void {
    const newAggregate: Aggregate = {
      id: this.aggregateCount++,
      field: '',
      aggregateFunction: ''
    };
    this.Aggregates.push(newAggregate)
  }

  removeAggregate(id: number): void {
    this.Aggregates = this.Aggregates.filter(f => f.id !== id);

    this.Aggregates.forEach((filter, index) => {
      filter.id = index;
    });

    this.UpdateAggregates.emit(this.Aggregates)

  }
  onAggregateChange() {

    const validAggregates = this.Aggregates.filter(agg =>
      agg.field && agg.field !== '' &&
      agg.aggregateFunction && agg.aggregateFunction !== ''
    );

    if (validAggregates.length > 0) {
      this.UpdateAggregates.emit(validAggregates);
    }
  }

  }
  

