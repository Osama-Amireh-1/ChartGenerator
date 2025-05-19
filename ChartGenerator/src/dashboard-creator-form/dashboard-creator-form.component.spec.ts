import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCreatorFormComponent } from './dashboard-creator-form.component';

describe('CreateDashboardFormComponent', () => {
  let component: DashboardCreatorFormComponent;
  let fixture: ComponentFixture<DashboardCreatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCreatorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCreatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
