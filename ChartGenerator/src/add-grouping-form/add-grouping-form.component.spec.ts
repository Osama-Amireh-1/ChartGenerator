import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupingFormComponent } from './add-grouping-form.component';

describe('AddGroupingFormComponent', () => {
  let component: AddGroupingFormComponent;
  let fixture: ComponentFixture<AddGroupingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
