import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarDate, LichService } from '../services/lich.service';
import { CalendarDayCellComponent } from '../components/calendar-day-cell/calendar-day-cell.component';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [
    CommonModule,
    CalendarDayCellComponent
  ],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
})
export class WeekViewComponent implements OnInit, OnDestroy {
  // Platform ID for browser checks
  private readonly platformId = inject(PLATFORM_ID);

  // Current date to display
  currentDate: Date = new Date();
  
  // Days of the week
  weekDays: string[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Calendar data for week
  weekCalendarDays: CalendarDate[] = [];
  
  // Event subscription
  eventSubscription?: Subscription;
  
  // Show Can Chi
  showCanChi: boolean = false;
  
  // Handle Can Chi visibility changes
  private canChiVisibilityHandler = (event: any) => {
    this.showCanChi = event.detail;
    console.log('Week view received Can Chi visibility change:', this.showCanChi);
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
      if (params['year'] && params['month'] && params['day']) {
        const year = parseInt(params['year'], 10);
        const month = parseInt(params['month'], 10) - 1; // Convert from 1-based to 0-based
        const day = parseInt(params['day'], 10);
        
        if (this.isValidDate(year, month, day)) {
          this.currentDate = new Date(year, month, day);
          this.generateWeekCalendar();
        }
      } else {
        this.generateWeekCalendar();
      }
      
      this.generateWeekCalendar();
    });
    
    // Subscribe to event changes (when filters change)
    this.eventSubscription = this.lichService.getEvents().subscribe(() => {
      this.generateWeekCalendar();
    });
    
    // Listen for Can Chi visibility changes from the parent component
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('canChiVisibilityChange', this.canChiVisibilityHandler);
      window.addEventListener('eventTypeVisibilityChange', this.eventTypeVisibilityHandler);
      
      // Try to load initial can chi value from localStorage
      const savedCanChiSetting = localStorage.getItem('showCanChi');
      if (savedCanChiSetting) {
        this.showCanChi = JSON.parse(savedCanChiSetting);
        console.log('Week view initialized showCanChi to:', this.showCanChi);
      }
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
    console.log('Week view caught event visibility change:', customEvent.detail);
    this.generateWeekCalendar();
  }
  
  /**
   * Generate the calendar days for the current week
   */
  generateWeekCalendar(): void {
    if (this.currentDate) {
      this.weekCalendarDays = this.lichService.generateWeekCalendar(this.currentDate);
    }
  }
  
  /**
   * Handle date change from the calendar controller
   */
  onDateChange(date: Date): void {
    this.currentDate = date;
    this.generateWeekCalendar();
  }
  
  /**
   * Handle view change from the calendar controller
   */
  onViewChange(view: string): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();
    
    if (view === 'month') {
      this.lichService.navigateToMonth(year, month);
    } else if (view === 'day') {
      this.lichService.navigateToDay(year, month, day);
    }
  }
  
  /**
   * Check if the provided date is valid
   */
  private isValidDate(year: number, month: number, day: number): boolean {
    return !isNaN(year) && !isNaN(month) && !isNaN(day) && 
           year > 1900 && year < 2100 && 
           month >= 0 && month <= 11 &&
           day >= 1 && day <= 31;
  }
}