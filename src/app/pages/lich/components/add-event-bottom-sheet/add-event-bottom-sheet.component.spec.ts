import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DatePipe } from '@angular/common';
import { AddEventBottomSheetComponent, AddEventData } from './add-event-bottom-sheet.component';
import { EventService } from '../../services/event.service';
import { CalendarDate } from '../../services/lich.service';

describe('AddEventBottomSheetComponent', () => {
  let component: AddEventBottomSheetComponent;
  let fixture: ComponentFixture<AddEventBottomSheetComponent>;
  let mockBottomSheetRef: jasmine.SpyObj<MatBottomSheetRef<AddEventBottomSheetComponent>>;
  let mockEventService: jasmine.SpyObj<EventService>;

  const mockCalendarDate: CalendarDate = {
    solar: {
      year: 2024,
      month: 1,
      day: 15,
      date: new Date(2024, 0, 15)
    },
    lunar: {
      year: 2024,
      month: 1,
      day: 15,
      isLeapMonth: false
    },
    canChi: {
      year: 'Giáp Thìn',
      month: 'Bính Dần',
      day: 'Nhâm Tuất'
    },
    isCurrentMonth: true,
    events: []
  };

  const mockData: AddEventData = {
    selectedDate: mockCalendarDate
  };

  beforeEach(async () => {
    mockBottomSheetRef = jasmine.createSpyObj('MatBottomSheetRef', ['dismiss']);
    mockEventService = jasmine.createSpyObj('EventService', ['addEvent']);

    await TestBed.configureTestingModule({
      imports: [AddEventBottomSheetComponent, NoopAnimationsModule],
      providers: [
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: mockData },
        { provide: EventService, useValue: mockEventService },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with selected date', () => {
    expect(component.eventForm.get('date')?.value).toEqual(mockCalendarDate.solar.date);
  });

  it('should format date correctly', () => {
    expect(component.formattedDate).toBe('15/01/2024');
  });

  it('should call eventService.addEvent when form is valid and onSave is called', async () => {
    const mockEventData = {
      title: 'Test Event',
      description: 'Test Description',
      date: mockCalendarDate.solar.date,
      createdAt: jasmine.any(Date),
      updatedAt: jasmine.any(Date)
    };

    component.eventForm.patchValue({
      title: 'Test Event',
      description: 'Test Description'
    });

    mockEventService.addEvent.and.returnValue(Promise.resolve(1));

    await component.onSave();

    expect(mockEventService.addEvent).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Event',
      description: 'Test Description',
      date: mockCalendarDate.solar.date
    }));
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
  });

  it('should dismiss bottom sheet when onCancel is called', () => {
    component.onCancel();
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
  });

  it('should not call addEvent when form is invalid', () => {
    component.eventForm.patchValue({
      title: '' // Invalid: empty title
    });

    component.onSave();

    expect(mockEventService.addEvent).not.toHaveBeenCalled();
  });
});
