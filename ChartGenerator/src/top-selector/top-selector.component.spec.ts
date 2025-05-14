import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSelectorComponent } from './top-selector.component';

describe('TopSelectorComponent', () => {
  let component: TopSelectorComponent;
  let fixture: ComponentFixture<TopSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
