import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChartResources } from '../chart-generator/Interface/chart-resources';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-grid-view',
  imports: [CdkDropList, CdkDrag, MatGridListModule, ChartComponent, CommonModule],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.css',
  standalone: true,

})


export class GridViewComponent {
  constructor(private cdr: ChangeDetectorRef) { }

  @Input() charts: ChartResources[] = [];
  items = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  drop(event: CdkDragDrop<ChartResources[]>) {
    console.log('From index:', event.previousIndex);
    console.log('To index:', event.currentIndex);

    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);

    console.log(this.charts);
  }
  trackChart(index: number, chart: any): any {
    console.log('Track chart', chart.Id); 
    return chart.Id;
}
}
