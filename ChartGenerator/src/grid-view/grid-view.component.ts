import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
export class GridViewComponent implements OnInit, OnChanges {
  constructor(private cdr: ChangeDetectorRef) {
      this.initGridsterOptions();
}

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
  @Output() chartPositionChanged = new EventEmitter<ChartResources>();
  @Output() chartRemoved = new EventEmitter<string>();
  @Input() isShowMode!: boolean
  ngOnInit(): void {
    this.initGridsterOptions();
    if (this.isShowMode) {
      this.toggleShowMode(this.isShowMode);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isShowMode']) {
      this.toggleShowMode(this.isShowMode);
    }
  }

  toggleShowMode(isShowMode: boolean): void {
    if (!this.gridsterOptions) return;

    this.gridsterOptions.draggable.enabled = !isShowMode;
    this.gridsterOptions.resizable.enabled = !isShowMode;
    this.gridsterOptions.displayGrid = isShowMode ? DisplayGrid.None : DisplayGrid.Always
    if (this.gridsterOptions.api?.optionsChanged) {
      this.gridsterOptions.api.optionsChanged();
    }
    this.cdr.detectChanges();
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

    const findFirstAvailablePosition = (): { x: number, y: number } => {
      const cols = this.gridsterOptions.minCols || 10;
      const maxRows = this.gridsterOptions.maxRows || 100;

      const occupiedPositions: boolean[][] = [];
      for (let y = 0; y < maxRows; y++) {
        occupiedPositions[y] = [];
        for (let x = 0; x < cols; x++) {
          occupiedPositions[y][x] = false;
        }
      }

      this.gridItems.forEach(item => {
        for (let y = item.y; y < item.y + item.rows; y++) {
          for (let x = item.x; x < item.x + item.cols; x++) {
            if (y < maxRows && x < cols) {
              occupiedPositions[y][x] = true;
            }
          }
        }
      });

      for (let y = 0; y < maxRows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!occupiedPositions[y][x]) {
            return { x, y };
          }
        }
      }

      return { x: 0, y: 0 };
    };

    this.charts.forEach((chart) => {
      const cols = +chart.NumberOfColumns || 1;
      const rows = +chart.NumberOfRows || 1;

      let x = chart.x !== undefined ? chart.x : null;
      let y = chart.y !== undefined ? chart.y : null;

      if (x === null || y === null) {
        const position = findFirstAvailablePosition();
        x = position.x;
        y = position.y;
      }

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
      console.log(item.x);
      console.log(item.x);

      this.chartPositionChanged.emit(item['chartData']);

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

    this.chartRemoved.emit(item.chartData.Id);

  }
}
