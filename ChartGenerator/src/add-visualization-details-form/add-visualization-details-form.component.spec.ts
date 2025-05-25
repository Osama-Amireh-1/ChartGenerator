import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisualizationDetailsFormComponent } from './add-visualization-details-form.component';

describe('AddVisualizationDetailsFormComponent', () => {
  let component: AddVisualizationDetailsFormComponent;
  let fixture: ComponentFixture<AddVisualizationDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVisualizationDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVisualizationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
