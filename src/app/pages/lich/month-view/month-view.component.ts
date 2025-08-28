import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarDate, LichService } from '../services/lich.service';
import { CalendarControllerComponent } from '../components/calendar-controller/calendar-controller.component';
import { CalendarDayCellComponent } from '../components/calendar-day-cell/calendar-day-cell.component';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [
    CommonModule,
    CalendarDayCellComponent
  ],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  providers: [DatePipe],
})
export class MonthViewComponent implements OnInit, OnDestroy {
  // Platform ID for browser checks
  private readonly platformId = inject(PLATFORM_ID);

  // Current date to display
  currentDate: Date = new Date();
  
  // Days of the week
  weekDays: string[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Calendar data
  calendarDays: CalendarDate[] = [];
  
  // Event subscription
  eventSubscription?: Subscription;
  
  // Show Can Chi
  showCanChi: boolean = false;
  
  // Handle Can Chi visibility changes
  private canChiVisibilityHandler = (event: any) => {
    this.showCanChi = event.detail;
    console.log('Month view received Can Chi visibility change:', this.showCanChi);
  };
  
  // Handle event type visibility changes
  private eventTypeVisibilityHandler = this.handleEventTypeVisibilityChange.bind(this);
  
  constructor(
    private route: ActivatedRoute,
    private lichService: LichService
  ) {}
  
  ngOnInit(): void {
    // Check for date params in the URL
    this.route.params.subscribe(params => {
      if (params['year'] && params['month']) {
        const year = parseInt(params['year'], 10);
        const month = parseInt(params['month'], 10) - 1; // Convert from 1-based to 0-based
        
        if (this.isValidDate(year, month)) {
          this.currentDate = new Date(year, month, 1);
          this.generateCalendarDays();
        }
      }
      
      this.generateCalendarDays();
    });
    
    // Subscribe to event changes (when filters change)
    this.eventSubscription = this.lichService.getEvents().subscribe(() => {
      this.generateCalendarDays();
    });
    
    // Listen for Can Chi visibility changes from the parent component
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('canChiVisibilityChange', this.canChiVisibilityHandler);
      window.addEventListener('eventTypeVisibilityChange', this.eventTypeVisibilityHandler);
      
      // Try to load initial can chi value from localStorage
      const savedCanChiSetting = localStorage.getItem('showCanChi');
      if (savedCanChiSetting) {
        this.showCanChi = JSON.parse(savedCanChiSetting);
      } else {
        // Default to showing Can Chi if no setting found
        this.showCanChi = true;
      }
      
      console.log('Month view initialized with Can Chi:', this.showCanChi);
    }
  }
  
  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    
    // Clean up event listeners
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('canChiVisibilityChange', this.canChiVisibilityHandler);
      window.removeEventListener('eventTypeVisibilityChange', this.eventTypeVisibilityHandler);
    }
  }
  
  /**
   * Handle event type visibility change events
   */
  private handleEventTypeVisibilityChange(event: Event): void {
    const customEvent = event as CustomEvent;
    console.log('Month view caught event visibility change:', customEvent.detail);
    this.generateCalendarDays();
  }
  
  /**
   * Generate the calendar days for the current month
   */
  generateCalendarDays(): void {
    if (this.currentDate) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1; // Convert 0-based to 1-based month
      this.calendarDays = this.lichService.getMonthCalendar(year, month);
    }
  }
  
  /**
   * Handle date change from the calendar controller
   */
  onDateChange(date: Date): void {
    this.currentDate = date;
    this.generateCalendarDays();
  }
  
  /**
   * Handle view change from the calendar controller
   */
  onViewChange(view: string): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();
    
    if (view === 'week') {
      this.lichService.navigateToWeek(year, month, day);
    } else if (view === 'day') {
      this.lichService.navigateToDay(year, month, day);
    }
  }
  
  /**
   * Check if the provided date is valid
   */
  private isValidDate(year: number, month: number): boolean {
    return !isNaN(year) && !isNaN(month) && 
      year > 1900 && year < 2100 && 
      month >= 0 && month <= 11;
  }
}