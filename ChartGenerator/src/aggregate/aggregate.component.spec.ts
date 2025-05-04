import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateComponent } from './aggregate.component';

describe('AggregateComponent', () => {
  let component: AggregateComponent;
  let fixture: ComponentFixture<AggregateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
