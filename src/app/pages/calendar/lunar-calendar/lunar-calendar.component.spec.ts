import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LunarCalendarComponent } from './lunar-calendar.component';

describe('LunarCalendarComponent', () => {
  let component: LunarCalendarComponent;
  let fixture: ComponentFixture<LunarCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LunarCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LunarCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
