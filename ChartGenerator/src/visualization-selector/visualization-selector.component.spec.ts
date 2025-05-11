import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationSelectorComponent } from './visualization-selector.component';

describe('ChartSelectorComponent', () => {
  let component: VisualizationSelectorComponent;
  let fixture: ComponentFixture<VisualizationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizationSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
