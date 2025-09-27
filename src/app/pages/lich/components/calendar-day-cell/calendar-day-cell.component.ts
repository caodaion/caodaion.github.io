import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarDate, CalendarEvent } from '../../services/lich.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventImageDialogComponent } from '../event-image-dialog/event-image-dialog.component';
import { Subscription, map, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AnChay } from 'src/app/pages/lich/components/an-chay/an-chay';

@Component({
  selector: 'app-calendar-day-cell',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './calendar-day-cell.component.html',
  styleUrls: ['./calendar-day-cell.component.scss'],
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
    private breakpointObserver: BreakpointObserver
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
   * Update visible events based on maximum events setting
   */
  updateEvents(): void {
    if (this.calendarDate && this.calendarDate.events) {
      this.hasEvents = this.calendarDate.events.length > 0;
      this.visibleEvents = this.calendarDate.events.slice(0, this.maxEvents);
    } else {
      this.hasEvents = false;
      this.visibleEvents = [];
    }
  }

  /**
   * Handle click on the day cell
   */
  onDayClick(): void {
    const year = this.calendarDate.solar.year;
    const month = this.calendarDate.solar.month;
    const day = this.calendarDate.solar.day;

    // Navigate to the day view with the selected date
    this.router.navigate(['/lich/d', year, month, day]);
  }

  /**
   * Handle click on an individual event
   */
  onEventClick(event: CalendarEvent, $event: MouseEvent): void {
    // Prevent event bubbling to avoid navigating to day view
    $event.stopPropagation();

    // Open the dialog
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
      panelClass: '',
      data: {
        showAnChay: this.showAnChay,
        date: this.calendarDate,
        calendarDays: this.calendarDays,
      },
      autoFocus: false,
    });
  }
}
