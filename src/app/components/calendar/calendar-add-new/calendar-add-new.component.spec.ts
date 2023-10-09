import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAddNewComponent } from './calendar-add-new.component';

describe('CalendarAddNewComponent', () => {
  let component: CalendarAddNewComponent;
  let fixture: ComponentFixture<CalendarAddNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarAddNewComponent]
    });
    fixture = TestBed.createComponent(CalendarAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
