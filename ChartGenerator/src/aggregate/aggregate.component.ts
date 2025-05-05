import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Aggregate } from '../chart-creator-form/Interfaces/Aggregate';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aggregate',
  imports: [CommonModule, FormsModule],
  templateUrl: './aggregate.component.html',
  styleUrl: './aggregate.component.css'
})
export class AggregateComponent implements OnChanges {

  @Input() Aggregates: Aggregate[] = [];
  aggregateCount = 0;
  @Input() columns: string[] = [];
  @Output() UpdateAggregates = new EventEmitter<Aggregate[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Aggregates'] && this.Aggregates) {
      this.aggregateCount = this.Aggregates.length > 0
        ? Math.max(...this.Aggregates.map(agg => agg.id)) + 1
        : 0;
    }
  }

  addAggregate(): void {
    const newAggregate: Aggregate = {
      id: this.aggregateCount++,
      field: '',
      aggregateFunction: ''
    };

    const updatedAggregates = [...this.Aggregates, newAggregate];
    this.Aggregates = updatedAggregates;
    this.UpdateAggregates.emit(updatedAggregates);
  }

  removeAggregate(id: number): void {
    const filteredAggregates = this.Aggregates.filter(agg => agg.id !== id);

    const updatedAggregates = filteredAggregates.map((agg, index) => ({
      ...agg,
      id: index
    }));

    this.aggregateCount = updatedAggregates.length;

    this.Aggregates = updatedAggregates;
    this.UpdateAggregates.emit(updatedAggregates);

  }
  onAggregateChange() {

    //const validAggregates = this.Aggregates.filter(agg =>
    //  agg.field && agg.field !== '' &&
    //  agg.aggregateFunction && agg.aggregateFunction !== ''
    //);

    //if (validAggregates.length > 0) {
    this.UpdateAggregates.emit(this.Aggregates);
    //}
  }

  }
  

