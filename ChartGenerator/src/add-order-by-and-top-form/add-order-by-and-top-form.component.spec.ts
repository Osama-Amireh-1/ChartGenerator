import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderByAndTopFormComponent } from './add-order-by-and-top-form.component';

describe('AddOrderByAndTopFormComponent', () => {
  let component: AddOrderByAndTopFormComponent;
  let fixture: ComponentFixture<AddOrderByAndTopFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrderByAndTopFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrderByAndTopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
