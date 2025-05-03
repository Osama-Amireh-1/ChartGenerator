import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartResources } from '../chart-generator/Interface/chart-resources';
import { ChartComponent } from '../chart/chart.component';
import { GridsterModule, GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterItemComponentInterface, GridsterComponentInterface } from 'angular-gridster2';

@Component({
  selector: 'app-grid-view',
  imports: [GridsterModule, ChartComponent, CommonModule],
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
  gridsterOptions: GridsterConfig = {};
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
      initCallback: GridViewComponent.gridInit,
      destroyCallback: GridViewComponent.gridDestroy,
      gridSizeChangedCallback: GridViewComponent.gridSizeChanged,
      itemChangeCallback: GridViewComponent.itemChange,
      itemResizeCallback: GridViewComponent.itemResize,
      itemInitCallback: GridViewComponent.itemInit,
      itemRemovedCallback: GridViewComponent.itemRemoved,
      itemValidateCallback: GridViewComponent.itemValidate,
      minCols: 7,
      maxCols: 100,
      minRows: 6,
      maxRows: 100,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: true,
      pushResizeItems: true,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      scrollToNewItems: true
    };
  }
  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemResized', item, itemComponent);
  }

  static itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemRemoved', item, itemComponent);
  }

  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  static gridInit(grid: GridsterComponentInterface): void {
    console.info('gridInit', grid);
  }

  static gridDestroy(grid: GridsterComponentInterface): void {
    console.info('gridDestroy', grid);
  }

  static gridSizeChanged(grid: GridsterComponentInterface): void {
    console.info('gridSizeChanged', grid);
  }
  updateGridItems(): void {
    this.gridItems = [];

    // Create a virtual occupation matrix to track filled grid cells
    const occupiedCells = {};

    this.charts.forEach((chart, index) => {
      const cols = +chart.NumberOfColumns || 1;
      const rows = +chart.NumberOfRows || 1;

      // If chart already has defined X,Y positions, use them
      if (chart.x !== undefined && chart.y !== undefined) {
        this.gridItems.push({
          cols: cols,
          rows: rows,
          x: chart.x,
          y: chart.y,
          chartData: chart
        });

        // Mark these cells as occupied
        this.markCellsAsOccupied(occupiedCells, chart.x, chart.y, cols, rows);
      } else {
        // Find the best position for this new item
        const position = this.findBestPosition(occupiedCells, cols, rows);

        chart.x = position.x;
        chart.y = position.y;

        this.gridItems.push({
          cols: cols,
          rows: rows,
          x: position.x,
          y: position.y,
          chartData: chart
        });

        // Mark these cells as occupied
        this.markCellsAsOccupied(occupiedCells, position.x, position.y, cols, rows);
      }
    });
  }

  // Helper method to mark cells as occupied
  markCellsAsOccupied(occupiedCells: any, x: number, y: number, cols: number, rows: number): void {
    for (let i = x; i < x + cols; i++) {
      for (let j = y; j < y + rows; j++) {
        const key = `${i},${j}`;
        occupiedCells[key] = true;
      }
    }
  }

  // Helper method to find the best available position
  findBestPosition(occupiedCells: any, cols: number, rows: number): { x: number, y: number } {
    // Start looking from the top-left
    let x = 0;
    let y = 0;

    // Maximum grid dimensions (from your gridsterOptions)
    const maxCols = this.gridsterOptions.maxCols || 100;
    const maxRows = this.gridsterOptions.maxRows || 100;

    // Find the first available position that can fit the item
    while (y < maxRows) {
      x = 0;
      while (x + cols <= maxCols) {
        if (this.isAreaAvailable(occupiedCells, x, y, cols, rows)) {
          return { x, y };
        }
        x++;
      }
      y++;
    }

    return { x: 0, y: 0 };
  }

  isAreaAvailable(occupiedCells: any, x: number, y: number, cols: number, rows: number): boolean {
    for (let i = x; i < x + cols; i++) {
      for (let j = y; j < y + rows; j++) {
        const key = `${i},${j}`;
        if (occupiedCells[key]) {
          return false;
        }
      }
    }
    return true;
  }

  onItemChange(item: GridsterItem): void {
    if (item['chartData']) {
      item['chartData'].NumberOfColumns = item.cols;
      item['chartData'].NumberOfRows = item.rows;
      item['chartData'].x = item.x;
      item['chartData'].y = item.y;

      if (this.gridsterOptions.api && typeof this.gridsterOptions.api.optionsChanged === 'function') {
        this.gridsterOptions.api.optionsChanged();
      }
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
    }
  }
}
