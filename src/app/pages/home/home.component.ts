import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  LichService,
  CalendarEvent,
} from '../lich/services/lich.service';
import { CalendarService } from '../../shared/services/calendar/calendar.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SeoService } from '../../shared/services/seo.service';
import { BaiThuongYeu } from "./components/bai-thuong-yeu/bai-thuong-yeu";
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, shareReplay } from 'rxjs';
import { EventImageDialogComponent } from '../lich/components/event-image-dialog/event-image-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, IconComponent, BaiThuongYeu],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [LichService, CalendarService, DatePipe],
})
export class HomeComponent implements OnInit, OnDestroy {
  private eventsSubscription?: any;
  // Current date information
  currentDate: Date = new Date();
  lunarDate?: {
    year: any;
    month: number;
    monthCanchi: any;
    dayCanchi: any;
    day: number;
    isLeapMonth: boolean;
  };

  // Today's events
  todayEvents: CalendarEvent[] = [];
  weekEvents: CalendarEvent[] = [];

  // Event type names lookup
  private readonly eventTypeNames: { [key: string]: string } = {
    'annual-solar': 'Hàng năm (DL)',
    'annual-lunar': 'Hàng năm (AL)',
    'monthly-solar': 'Hàng tháng (DL)',
    'monthly-lunar': 'Hàng tháng (AL)',
    'tuan-cuu': 'Tuần Cửu',
    daily: 'Hàng ngày',
    user: 'Cá nhân',
  };

  // Subscriptions
  private subscriptions: Subscription[] = [];
  isMobileView: boolean = false;

  constructor(
    private calendarService: CalendarService,
    private lichService: LichService,
    private seoService: SeoService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }

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
    this.setSeoMetadata();
    // Subscribe to events changes
    this.eventsSubscription = this.lichService.getEvents().subscribe(events => {
      this.loadTodayData();
    });
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  /**
   * Set SEO metadata for the home page
   */
  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: 'Trang chủ',
      description: 'CaoDaiON - Ứng dụng Cao Đài trực tuyến cung cấp lịch âm dương, các ngày lễ Đạo và công cụ thực hành tâm linh',
      url: '', // Base URL
      keywords: 'Cao Đài, CaoDaiON, lịch âm, lịch dương, tôn giáo, Việt Nam, lịch vạn niên'
    });
  }

  /**
   * Load today's lunar date and events
   */
  private loadTodayData(): void {
    // Get today's calendar data
    const todayDate = this.lichService
      .getMonthCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1
      )
      .find((day) => {
        return (
          day.solar.day === this.currentDate.getDate() &&
          day.solar.month === this.currentDate.getMonth() + 1 &&
          day.solar.year === this.currentDate.getFullYear()
        );
      });

    const endOfWeekDate = moment().endOf('week')?.toDate();
    const weekDates = this.lichService
      .getMonthCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1
      )?.filter((day: any) => {
        return (
          day?.events?.length > 0 &&
          day.solar.day >= new Date().getDate() &&
          day.solar.day <= endOfWeekDate.getDate() &&
          day.solar.month === endOfWeekDate.getMonth() + 1 &&
          day.solar.year === endOfWeekDate.getFullYear()
        );
      });

    weekDates?.forEach((day: any) => {
      day.events = day?.events?.map((de: any) => ({
        ...de,
        dateData: day,
      }))
      this.weekEvents.push(...day.events);
    })

    if (todayDate) {
      const lunar = this.calendarService.getConvertedFullDate(
        new Date()
      ).convertSolar2Lunar;
      this.lunarDate = {
        year: lunar?.lunarYearName,
        month: lunar?.lunarMonth,
        monthCanchi: lunar?.lunarMonthName,
        dayCanchi: lunar?.lunarDayName,
        day: lunar?.lunarDay,
        isLeapMonth: lunar?.lunarLeap,
      };
      this.todayEvents = todayDate.events;
    } else {
      // Fallback in case calendar service doesn't return today's date
      const lunar = this.calendarService.getConvertedFullDate(
        this.currentDate
      ).convertSolar2Lunar;
      this.lunarDate = {
        year: lunar?.lunarYearName,
        month: lunar?.lunarMonth,
        monthCanchi: lunar?.lunarMonthName,
        day: lunar?.lunarDay,
        dayCanchi: lunar?.lunarDayName,
        isLeapMonth: lunar?.lunarLeap,
      };
    }
  }

  /**
   * Get readable name for event type
   */
  getEventTypeName(type: string): string {
    return this.eventTypeNames[type] || type;
  }

  onEventClick(date: any): void {
    // Open the dialog
    this.dialog.open(EventImageDialogComponent, {
      width: this.isMobileView ? '100%' : '600px',
      maxWidth: this.isMobileView ? '100%' : '600px',
      panelClass: 'event-image-dialog-container',
      data: {
        event: date,
        dateData: date?.dateData,
      },
      autoFocus: false,
    });
  }
}
