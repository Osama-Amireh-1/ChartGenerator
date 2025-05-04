import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGroupsComponent } from './filter-groups.component';

describe('FilterGroupsComponent', () => {
  let component: FilterGroupsComponent;
  let fixture: ComponentFixture<FilterGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
