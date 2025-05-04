import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSelectorComponent } from './table-selector.component';

describe('SelectTableComponent', () => {
  let component: TableSelectorComponent;
  let fixture: ComponentFixture<TableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
