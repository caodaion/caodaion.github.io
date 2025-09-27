import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
import { EventSignService } from 'src/app/shared/services/event-sign.service';
import { MatDividerModule } from '@angular/material/divider';
import { PwaInstallService } from '../../shared/services/pwa-install/pwa-install.service';
import { TourAnchorMatMenuDirective } from "ngx-ui-tour-md-menu";
import { TourStepTemplateComponent } from "ngx-ui-tour-md-menu";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule, MatDividerModule, IconComponent, BaiThuongYeu, TourAnchorMatMenuDirective, TourStepTemplateComponent],
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
  tomorrowEvents: CalendarEvent[] = [];
  weekEvents: CalendarEvent[] = [];
  eventSigns: any[] = [];

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
    private breakpointObserver: BreakpointObserver,
    private eventSignService: EventSignService,
    private pwaInstallService: PwaInstallService
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
    this.eventSigns = this.eventSignService.getEventSigns();
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
    // Get tomorrow's calendar data
    const tomorrowDate = this.lichService
      .getMonthCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1
      )
      .find((day) => {
        return (
          day.solar.day === this.currentDate.getDate() + 1 &&
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

    if (tomorrowDate) {
      const lunar = this.calendarService.getConvertedFullDate(
        new Date(new Date().setDate(new Date().getDate() + 1))
      ).convertSolar2Lunar;
      this.lunarDate = {
        year: lunar?.lunarYearName,
        month: lunar?.lunarMonth,
        monthCanchi: lunar?.lunarMonthName,
        dayCanchi: lunar?.lunarDayName,
        day: lunar?.lunarDay,
        isLeapMonth: lunar?.lunarLeap,
      };
      tomorrowDate.events = tomorrowDate.events.map((event: any) => ({
        ...event,
        dateData: tomorrowDate,
        description: `${event?.title} ${event?.eventTime ? 'vào thời ' + event?.eventTime : ''} ngày ${tomorrowDate?.lunar?.day} tháng ${tomorrowDate?.lunar?.month} năm ${tomorrowDate?.lunar?.year} (${tomorrowDate.solar.day}/${tomorrowDate.solar.month}/${tomorrowDate.solar.year})`
      }));
      this.tomorrowEvents = tomorrowDate.events;
    }

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
      this.todayEvents?.forEach((event: any) => {
        event.dateData = todayDate;
      });
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

    weekDates?.forEach((day: any) => {
      day.events = day?.events?.map((de: any) => ({
        ...de,
        dateData: day,
      }))
      day.events?.forEach((event: any) => {
        if (!this.todayEvents?.some(e => e.id === event.id) && !this.tomorrowEvents?.some(e => e.id === event.id) && !this.weekEvents.some(e => e.id === event.id)) {
          event.dateString = `${event?.eventTime ? 'thời ' + event?.eventTime : ''} ngày ${event?.dateData?.lunar?.day} tháng ${event?.dateData?.lunar?.month} năm ${event?.dateData?.lunar?.year} (${day.solar.day}/${day.solar.month}/${day.solar.year})`;
          if (event?.type === 'tuan-cuu') {
            event.description = `${event?.title} vào ${event.dateString}`;
          }
          this.weekEvents.push(event);
        }
      })
    })
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

  // PWA Install methods
  get canInstallPwa(): boolean {
    return this.pwaInstallService.canInstall;
  }

  get isPwaInstalled(): boolean {
    return this.pwaInstallService.isInstalled;
  }

  get showIOSInstructions(): boolean {
    return this.pwaInstallService.showIOSInstallInstructions();
  }

  async installPwa(): Promise<void> {
    const success = await this.pwaInstallService.installPwa();
    if (success) {
      console.log('PWA installation initiated successfully');
    }
  }

  getInstallInstructions(): string {
    return this.pwaInstallService.getInstallInstructions();
  }
}
