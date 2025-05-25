import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAggregateFormComponent } from './add-aggregate-form.component';

describe('AddAggregateFormComponent', () => {
  let component: AddAggregateFormComponent;
  let fixture: ComponentFixture<AddAggregateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAggregateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAggregateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
