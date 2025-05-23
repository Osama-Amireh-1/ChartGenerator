import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByComponent } from './group-by.component';

describe('GroupByComponent', () => {
  let component: GroupByComponent;
  let fixture: ComponentFixture<GroupByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
