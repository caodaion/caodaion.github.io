import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, IconComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [LichService, CalendarService, DatePipe],
})
export class HomeComponent implements OnInit {
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

  // Event type names lookup
  private readonly eventTypeNames: { [key: string]: string } = {
    'annual-solar': 'Hàng năm (DL)',
    'annual-lunar': 'Hàng năm (AL)',
    'monthly-solar': 'Hàng tháng (DL)',
    'monthly-lunar': 'Hàng tháng (AL)',
    daily: 'Hàng ngày',
    user: 'Cá nhân',
  };

  constructor(
    private calendarService: CalendarService,
    private lichService: LichService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.loadTodayData();
    this.setSeoMetadata();
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
}
