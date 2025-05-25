import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aggregate } from '../Interfaces/Aggregate';

@Component({
  selector: 'app-aggregate',
  imports: [CommonModule, FormsModule],
  templateUrl: './aggregate.component.html',
  styleUrl: './aggregate.component.css'
})
export class AggregateComponent implements OnChanges {

  @Input() aggregates: Aggregate[] = [];
  aggregateCount = 0;
  @Input() columns: string[] = [];
  @Output() addAggregates = new EventEmitter<Aggregate[]>();
  @Output() removeAggregates = new EventEmitter<Aggregate[]>();
  @Input() addNewAggregate = false

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['aggregates'] && this.aggregates) {
      this.aggregateCount = this.aggregates.length > 0
        ? Math.max(...this.aggregates.map(agg => agg.id)) + 1
        : 0;
    }
    if (changes['addNewAggregate'] && this.addNewAggregate == true) {
      this.addAggregate()
    }
  }

  addAggregate(): void {
    const newAggregate: Aggregate = {
      id: this.aggregateCount++,
      field: '',
      aggregateFunction: ''
    };

    const updatedAggregates = [...this.aggregates, newAggregate];
    this.aggregates = updatedAggregates;
    this.addAggregates.emit(updatedAggregates);
  }

  removeAggregate(id: number): void {
    const filteredAggregates = this.aggregates.filter(agg => agg.id !== id);

    const updatedAggregates = filteredAggregates.map((agg, index) => ({
      ...agg,
      id: index
    }));

    this.aggregateCount = updatedAggregates.length;

    this.aggregates = updatedAggregates;


    this.removeAggregates.emit(updatedAggregates);

  }
  onAggregateChange() {


    this.addAggregates.emit(this.aggregates);

  }

  handleAddNewAggregate() {
    //this.addNewAggregate = true;
    //setTimeout(() => this.addNewAggregate = false, 0);
    this.addAggregate()

  }
  isAllowToAddNewAggregate(): boolean {
    for (var i = 0; i < this.aggregates.length; i++) {
      if (this.aggregates[i].field == "" || this.aggregates[i].aggregateFunction == "") {
        return false
      }
    }
    return true

  }

  }
  

