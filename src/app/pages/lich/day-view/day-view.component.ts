import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay, Subscription } from 'rxjs';
import { CalendarDate, CalendarEvent, LichService } from '../services/lich.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventImageDialogComponent } from '../components/event-image-dialog/event-image-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
})
export class DayViewComponent implements OnInit, OnDestroy {
  // Platform ID for browser checks
  private readonly platformId = inject(PLATFORM_ID);
  
  // Current date to display
  currentDate: Date = new Date();
  
  // Calendar data for the current day
  currentDayData?: CalendarDate;
  
  // Event subscription
  eventSubscription?: Subscription;
  // Subscriptions
  private subscriptions: Subscription[] = [];
  isMobileView: boolean = false;
  
  // Event visibility change handler
  private eventTypeVisibilityHandler = this.handleEventTypeVisibilityChange.bind(this);
  
  constructor(
    private route: ActivatedRoute,
    private lichService: LichService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) {}
  
  ngOnInit(): void {
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
    // Check for date params in the URL
    this.route.params.subscribe(params => {
      if (params['year'] && params['month'] && params['day']) {
        const year = parseInt(params['year'], 10);
        const month = parseInt(params['month'], 10) - 1; // Convert from 1-based to 0-based
        const day = parseInt(params['day'], 10);
        
        if (this.isValidDate(year, month, day)) {
          this.currentDate = new Date(year, month, day);
          this.loadDayData();
        }
      } else {
        this.loadDayData();
      }
    });
    
    // Subscribe to event changes (when filters change)
    this.eventSubscription = this.lichService.getEvents().subscribe(() => {
      this.loadDayData();
    });
    
    // Listen for event type visibility changes
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('eventTypeVisibilityChange', this.eventTypeVisibilityHandler);
    }
  }
  
  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    
    // Clean up event listener
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('eventTypeVisibilityChange', this.eventTypeVisibilityHandler);
    }
  }
  
  /**
   * Handle event type visibility change events
   */
  private handleEventTypeVisibilityChange(event: Event): void {
    const customEvent = event as CustomEvent;
    console.log('Day view caught event visibility change:', customEvent.detail);
    this.loadDayData();
  }
  
  /**
   * Load calendar data for the current day
   */
  loadDayData(): void {
    if (this.currentDate) {
      this.currentDayData = this.lichService.generateDayData(this.currentDate);
    }
  }
  
  /**
   * Format the day title (e.g., "Thứ Hai, 15 tháng 8, 2023")
   */
  formatDayTitle(dayData: CalendarDate): string {
    // Format date with Vietnamese weekday names
    const weekdayName = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const weekday = weekdayName[dayData.solar.date.getDay()];
    const day = dayData.solar.day;
    const month = dayData.solar.month;
    const year = dayData.solar.year;
    
    return `${weekday}, ${day} tháng ${month}, ${year}`;
  }
  
  /**
   * Handle date change from the calendar controller
   */
  onDateChange(date: Date): void {
    this.currentDate = date;
    this.loadDayData();
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
    } else if (view === 'week') {
      this.lichService.navigateToWeek(year, month, day);
    }
  }
  
  /**
   * Get the color for an event based on its type
   */
  getEventColor(event: CalendarEvent): string {
    switch (event.type) {
      case 'annual-solar':
        return '#e74c3c';
      case 'annual-lunar':
        return '#2ecc71';
      case 'monthly-solar':
        return '#3498db';
      case 'monthly-lunar':
        return '#9b59b6';
      case 'daily':
        return '#673AB7';
      case 'user':
        return '#009688';
      case 'tuan-cuu':
        return '#9C27B0';
      default:
        return '#95a5a6';
    }
  }
  
  /**
   * Open the event image dialog when an event is clicked
   */
  openEventImageDialog(event: CalendarEvent): void {
    if (!this.currentDayData) return;
    
    this.dialog.open(EventImageDialogComponent, {
      width: this.isMobileView ? '100%' : '600px',
      maxWidth: this.isMobileView ? '100%' : '600px',
      panelClass: 'event-image-dialog-container',
      data: {
        event: event,
        dateData: this.currentDayData
      },
      autoFocus: false
    });
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