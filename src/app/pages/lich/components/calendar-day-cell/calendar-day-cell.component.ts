import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarDate, CalendarEvent } from '../../services/lich.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventImageDialogComponent } from '../event-image-dialog/event-image-dialog.component';
import { Subscription, map, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AnChay } from 'src/app/pages/lich/components/an-chay/an-chay';
import { MatMenuModule } from "@angular/material/menu";
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { LichEventService } from '../../services/event.service';
import { LichService } from '../../services/lich.service';
import { AddEventMenu } from "../add-event-menu/add-event-menu";

@Component({
  selector: 'app-calendar-day-cell',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    MatBottomSheetModule, 
    AddEventMenu
  ],
  templateUrl: './calendar-day-cell.component.html',
  styleUrls: ['./calendar-day-cell.component.scss'],
  providers: [DatePipe],
})
export class CalendarDayCellComponent implements OnInit, OnDestroy {
  // Input data for the calendar day
  @Input() calendarDate!: CalendarDate;
  @Input() calendarDays!: CalendarDate[];
  @Input() showCanChi: boolean = false;
  @Input() isCurrentMonth: boolean = false;

  // States
  isToday: boolean = false;
  isSelected: boolean = false;
  hasEvents: boolean = false;

  // Platform ID for browser environment checks
  private platformId = inject(PLATFORM_ID);
  private datePipe = inject(DatePipe)

  // Maximum number of events to show in the cell
  maxEvents: number = 3;

  // Filtered events visible in the cell
  visibleEvents: CalendarEvent[] = [];

  // Event visibility change handler
  private eventTypeVisibilityHandler =
    this.handleEventTypeVisibilityChange.bind(this);

  // Subscriptions
  private subscriptions: Subscription[] = [];
  isMobileView: boolean = false;
  showAnChay = <any>{
    'luc-trai': true,
    'thap-trai': false,
    'thien-nguon': false
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private lichEventService: LichEventService,
    private lichService: LichService
  ) { }

  ngOnInit(): void {
    const savedAnChaySetting = localStorage.getItem('showAnChay');
    if (savedAnChaySetting) {
      this.showAnChay = JSON.parse(savedAnChaySetting);
    }
    // Monitor screen size changes
    this.subscriptions.push(
      this.breakpointObserver
        .observe('(max-width: 768px)')
        .pipe(
          map((result) => result.matches),
          shareReplay()
        )
        .subscribe((isMobile) => {
          this.isMobileView = isMobile;
        })
    );
    if (isPlatformBrowser(this.platformId)) {
      // Check if the date is today
      const today = new Date();
      this.isToday = this.isSameDay(this.calendarDate.solar.date, today);

      // Load personal events from IndexedDB
      this.loadPersonalEventsForDate();

      // Update events visibility
      this.updateEvents();

      // Listen for event type visibility changes
      window.addEventListener(
        'eventTypeVisibilityChange',
        this.eventTypeVisibilityHandler
      );
    }
    window.addEventListener(
      'anChayVisibilityChange',
      this.anChayVisibilityHandler
    );
  }

  ngOnDestroy(): void {
    // Clean up event listener
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener(
        'eventTypeVisibilityChange',
        this.eventTypeVisibilityHandler
      );
    }
  }

  /**
   * Handle event type visibility change events
   */
  private handleEventTypeVisibilityChange(event: Event): void {
    const customEvent = event as CustomEvent;
    // Only update if this is the event type that changed
    if (
      this.calendarDate?.events?.some((e) => e.type === customEvent.detail.type)
    ) {
      console.log(
        'Day cell updating for event type change:',
        customEvent.detail
      );
      this.updateEvents();
    }
  }

  /**
   * Update visible events based on maximum events setting and filter visibility
   */
  updateEvents(): void {
    if (this.calendarDate && this.calendarDate.events) {
      // Filter events based on eventTypeVisibility from LichService
      const filteredEvents = this.calendarDate.events.filter(event => {
        // Check if this event type is visible
        return this.lichService.isEventTypeVisible(event.type);
      });

      this.hasEvents = filteredEvents.length > 0;
      this.visibleEvents = filteredEvents.slice(0, this.maxEvents);
    } else {
      this.hasEvents = false;
      this.visibleEvents = [];
    }
  }

  /**
   * Handle click on an individual event
   */
  onEventClick(event: CalendarEvent, $event: MouseEvent): void {
    // Prevent event bubbling to avoid navigating to day view
    $event.stopPropagation();

    // Always open the original dialog for all event types
    this.dialog.open(EventImageDialogComponent, {
      width: this.isMobileView ? '100%' : '600px',
      maxWidth: this.isMobileView ? '100%' : '600px',
      panelClass: 'event-image-dialog-container',
      data: {
        event: event,
        dateData: this.calendarDate,
      },
      autoFocus: false,
    });
  }

  /**
   * Check if two dates are the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }


  // Event visibility change handler
  private anChayVisibilityHandler =
    this.handleAnChayVisibilityChange.bind(this);
  handleAnChayVisibilityChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const localStorageValue = localStorage.getItem('showAnChay');
    if (localStorageValue) {
      try {
        this.showAnChay = customEvent.detail;
      } catch { }
    }
  }

  isShowAnChay(type: string): boolean {
    if (!this.calendarDate || !this.calendarDate.lunar) return false;
    if (!this.showAnChay[type]) return false;
    switch (type) {
      case 'luc-trai':
        return this.calendarDate['6'] === true;
      case 'thap-trai':
        return this.calendarDate['10'] === true;
      case 'thien-nguon':
        return this.calendarDate['16'] === true;
      default:
        return false;
    }
  }

  onAnChayClick(): void {
    this.dialog.open(AnChay, {
      width: this.isMobileView ? '100%' : '600px',
      maxWidth: this.isMobileView ? '100%' : '600px',
      panelClass: 'an-chay-dialog-container',
      data: {
        showAnChay: this.showAnChay,
        date: this.calendarDate,
        calendarDays: this.calendarDays,
      },
      autoFocus: false,
    });
  }

  private refreshEventsForDate(): void {
    // Lấy lại events cho ngày hiện tại từ IndexedDB
    this.lichEventService.getEventsByDate(this.calendarDate.solar.date).then(events => {
      // Cập nhật calendarDate.events với dữ liệu từ IndexedDB
      if (!this.calendarDate.events) {
        this.calendarDate.events = [];
      }

      // Merge events từ IndexedDB với events hiện có
      const indexedDBEvents = events.map(event => ({
        id: event.id?.toString() || '',
        title: event.title,
        description: event.description,
        dateString: event.date.toISOString(),
        type: 'user' as const,
        color: '#2196F3',
        textColor: '#FFFFFF',
        allDay: true,
        startTime: event.startTime,
        endTime: event.endTime,
        solar: {
          year: event.date.getFullYear(),
          month: event.date.getMonth() + 1,
          day: event.date.getDate()
        }
      }));

      // Thêm events mới từ IndexedDB vào calendarDate.events
      indexedDBEvents.forEach(newEvent => {
        if (!this.calendarDate.events.some(existingEvent =>
          existingEvent.title === newEvent.title &&
          existingEvent.dateString === newEvent.dateString
        )) {
          this.calendarDate.events.push(newEvent);
        }
      });

      // Thêm events vào LichService để có thể được filter
      indexedDBEvents.forEach(newEvent => {
        if (!this.lichService.events.some(existingEvent =>
          existingEvent.id === newEvent.id
        )) {
          this.lichService.events.push(newEvent);
        }
      });

      // Trigger update để refresh calendar
      this.lichService['updateEvents']?.();
      this.updateEvents();
    }).catch(error => {
      console.error('Lỗi khi lấy events từ IndexedDB:', error);
    });
  }

  private loadPersonalEventsForDate(): void {
    // Load personal events from IndexedDB for this specific date
    this.lichEventService.getEventsByDate(this.calendarDate.solar.date).then(events => {
      if (events.length > 0) {
        // Convert IndexedDB events to CalendarEvent format
        const personalEvents = events.map(event => ({
          id: event.id?.toString() || '',
          title: event.title,
          description: event.description,
          dateString: event.date.toISOString(),
          type: 'user' as const,
          color: '#2196F3',
          textColor: '#FFFFFF',
          allDay: true,
          startTime: event.startTime,
          endTime: event.endTime,
          solar: {
            year: event.date.getFullYear(),
            month: event.date.getMonth() + 1,
            day: event.date.getDate()
          }
        }));

        // Add to calendarDate.events if not already present
        if (!this.calendarDate.events) {
          this.calendarDate.events = [];
        }

        personalEvents.forEach(newEvent => {
          if (!this.calendarDate.events.some(existingEvent =>
            existingEvent.id === newEvent.id
          )) {
            this.calendarDate.events.push(newEvent);
          }
        });

        // Add to LichService.events if not already present
        personalEvents.forEach(newEvent => {
          if (!this.lichService.events.some(existingEvent =>
            existingEvent.id === newEvent.id
          )) {
            this.lichService.events.push(newEvent);
          }
        });

        this.updateEvents();
      }
    }).catch(error => {
      console.error('Lỗi khi load personal events:', error);
    });
  }

  private handlePersonalEventDialogResult(result: any): void {
    if (result.action === 'deleted') {
      // Remove event from calendarDate.events
      if (this.calendarDate.events) {
        this.calendarDate.events = this.calendarDate.events.filter(e => e.id !== result.event.id);
      }

      // Remove event from LichService.events
      this.lichService.events = this.lichService.events.filter(e => e.id !== result.event.id);

      // Trigger update
      this.lichService['updateEvents']?.();
      this.updateEvents();

      console.log('Sự kiện đã được xóa');
    } else if (result.action === 'updated' || result.action === 'created') {
      // Refresh events for this date
      this.refreshEventsForDate();
      console.log('Sự kiện đã được cập nhật/tạo');
    }
  }
}
