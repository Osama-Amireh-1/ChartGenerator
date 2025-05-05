import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartResources } from '../chart/Interface/chart-resources';
import { ChartComponent } from '../chart/chart.component';
import { GridsterModule, GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterItemComponentInterface, GridsterComponentInterface, PushDirections, Resizable, Draggable, GridsterItemComponent, GridsterComponent } from 'angular-gridster2';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '../table/table.component';

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

@Component({
  selector: 'app-grid-view',
  imports: [GridsterModule, ChartComponent, CommonModule, GridsterItemComponent, GridsterComponent, MatIconModule, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.css',
  standalone: true,
})
export class GridViewComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) { }

  @Input() set charts(value: ChartResources[]) {
    this._charts = value;
    if (value?.length) {
      this.updateGridItems();

    }
  }

  get charts(): ChartResources[] {
    return this._charts;
  }

  private _charts: ChartResources[] = [];
  gridsterOptions!: Safe;
  gridItems: Array<GridsterItem & { chartData: ChartResources }> = [];

  ngOnInit(): void {
    this.initGridsterOptions();
  }

  initGridsterOptions(): void {
    this.gridsterOptions = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 10,
      maxCols: 100,
      minRows: 7,
      maxRows: 100,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      draggable: {
        enabled: true,
        ignoreContent: false,
        dragHandleClass: 'drag-handler'
      },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      scrollToNewItems: true,
      pushDirections: { north: true, east: true, south: true, west: true },
      itemChangeCallback: this.onItemChange.bind(this),


    };
  }

  updateGridItems(): void {
    this.gridItems = [];

    const calculatePosition = (index: number): { x: number, y: number } => {
      const cols = this.gridsterOptions.minCols || 10;
      return {
        x: index % cols,
        y: Math.floor(index / cols)
      };
    };

    this.charts.forEach((chart, index) => {
      const cols = +chart.NumberOfColumns || 1;
      const rows = +chart.NumberOfRows || 1;

      const position = calculatePosition(index);
      const x = chart.x !== undefined ? chart.x : position.x;
      const y = chart.y !== undefined ? chart.y : position.y;

      const item: GridsterItem & { chartData: ChartResources } = {
        cols: cols,
        rows: rows,
        x: x,
        y: y,
        chartData: chart
      };

      this.gridItems.push(item);
    });

      if (this.gridsterOptions.api && this.gridsterOptions.api.optionsChanged) {
        this.gridsterOptions.api.optionsChanged();
        this.cdr.detectChanges();
      }
    
  }

  onItemChange(item: GridsterItem): void {
    if (item['chartData']) {
      item['chartData'].NumberOfColumns = item.cols;
      item['chartData'].NumberOfRows = item.rows;
      item['chartData'].x = item.x;
      item['chartData'].y = item.y;

    }
  }

  trackById(index: number, item: any): any {
    return item.chartData.Id;
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem & { chartData: ChartResources; }): void {
    $event.preventDefault();
    $event.stopPropagation();

    const index = this.gridItems.findIndex(gridItem =>
      gridItem.chartData.Id === item.chartData.Id);

    if (index !== -1) {
      this.gridItems.splice(index, 1);
      const chartIndex = this._charts.findIndex(chart => chart.Id === item.chartData.Id);
      if (chartIndex !== -1) {
        this._charts.splice(chartIndex, 1);
      }

        if (this.gridsterOptions.api && this.gridsterOptions.api.optionsChanged) {
          this.gridsterOptions.api.optionsChanged();
        }
      
    }
  }
}
