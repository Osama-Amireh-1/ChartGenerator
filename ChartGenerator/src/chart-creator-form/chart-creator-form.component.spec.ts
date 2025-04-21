import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCreatorFormComponent } from './chart-creator-form.component';

describe('ChartCreatorFormComponent', () => {
  let component: ChartCreatorFormComponent;
  let fixture: ComponentFixture<ChartCreatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCreatorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCreatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
