import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { TuanCuuCalendarService } from './tuan-cuu-calendar.service';
import { TuanCuuService } from '../../tuan-cuu/services/tuan-cuu.service';

export interface CalendarDate {
  solar: {
    year: number;
    month: number;
    day: number;
    date: Date;
    dayOfWeek: number;
  };
  lunar: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
  canChi: {
    day: string;
    month: string;
    year: string;
  };
  isToday: boolean;
  '6'?: boolean;
  '10'?: boolean;
  '16'?: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  dateString?: string;
  subtitle?: string;
  type: 'annual-solar' | 'annual-lunar' | 'monthly-solar' | 'monthly-lunar' | 'daily' | 'user' | 'tuan-cuu' | 'thanhso';
  color: string;
  textColor?: string;
  allDay: boolean;
  isHoliday?: boolean;
  eventTime?: string; // Time for the event ceremony, default is "Dậu" for Tuan Cuu events
  startTime?: string; // Start time for personal events (HH:mm format)
  endTime?: string; // End time for personal events (HH:mm format)
  tuanCuuId?: string;
  solar?: {
    year?: number;
    month?: number;
    day?: number;
  };
  lunar?: {
    year?: number;
    month?: number;
    day?: number;
    isLeapMonth?: boolean;
  };
}

export type CalendarViewType = 'month' | 'week' | 'day';
export type EventType = 'annual-solar' | 'annual-lunar' | 'monthly-solar' | 'monthly-lunar' | 'daily' | 'user';

@Injectable({
  providedIn: 'root'
})
export class LichService {
  public events: CalendarEvent[] = [];
  private eventTypeVisibility: { [key: string]: boolean } = {
    'annual-solar': true,
    'annual-lunar': true,
    'monthly-solar': true,
    'monthly-lunar': true,
    'daily': false,
    'user': true,
    'tuan-cuu': true
  };
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private readonly CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  private readonly CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

  constructor(
    private calendarService: CalendarService,
    private tuanCuuCalendarService: TuanCuuCalendarService
  ) {
    // Load event type visibility settings from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedEventTypes = localStorage.getItem('eventTypeVisibility');
      if (savedEventTypes) {
        this.eventTypeVisibility = { ...this.eventTypeVisibility, ...JSON.parse(savedEventTypes) };
      }
    }

    this.initializeEvents();
    this.loadTuanCuuEvents();
  }

  private initializeEvents(): void {
    this.events = [
      {
        id: 'new-year',
        title: 'Tết Dương lịch',
        description: 'Ngày đầu năm mới theo dương lịch',
        type: 'annual-solar',
        color: '#e74c3c',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        solar: { month: 1, day: 1 }
      },
      {
        id: 'lunar-new-year',
        title: 'Tết Nguyên Đán',
        description: 'Ngày đầu năm mới theo âm lịch',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 1, day: 1 }
      },
      // TỨ THỜI - Four daily worship times
      {
        id: 'cung-thoi-ty',
        title: 'Cúng thời Tý',
        description: 'Cúng thời Tý (23:00-01:00)',
        type: 'daily',
        color: '#673AB7',
        textColor: '#ffffff',
        allDay: false,
        lunar: {}
      },
      {
        id: 'cung-thoi-meo',
        title: 'Cúng thời Mẹo',
        description: 'Cúng thời Mẹo (05:00-07:00)',
        type: 'daily',
        color: '#673AB7',
        textColor: '#ffffff',
        allDay: false,
        lunar: {}
      },
      {
        id: 'cung-thoi-ngo',
        title: 'Cúng thời Ngọ',
        description: 'Cúng thời Ngọ (11:00-13:00)',
        type: 'daily',
        color: '#673AB7',
        textColor: '#ffffff',
        allDay: false,
        lunar: {}
      },
      {
        id: 'cung-thoi-dau',
        title: 'Cúng thời Dậu',
        description: 'Cúng thời Dậu (17:00-19:00)',
        type: 'daily',
        color: '#673AB7',
        textColor: '#ffffff',
        allDay: false,
        lunar: {}
      },
      // SÓC NHỰT - 1st day of lunar month
      {
        id: 'soc-nhut',
        title: 'Sóc nhựt',
        description: 'Ngày mùng 1 âm lịch hàng tháng',
        type: 'monthly-lunar',
        color: '#9b59b6',
        textColor: '#ffffff',
        allDay: true,
        lunar: { day: 1 }
      },
      // VỌNG NHỰT - 15th day of lunar month (Full moon)
      {
        id: 'vong-nhut',
        title: 'Vọng nhựt',
        description: 'Ngày 15 âm lịch hàng tháng',
        type: 'monthly-lunar',
        color: '#9b59b6',
        textColor: '#ffffff',
        allDay: true,
        lunar: { day: 15 }
      },
      // Major Religious Holy Days
      {
        id: 'via-duc-chi-ton',
        title: 'Đại lễ Vía Đức Chí Tôn',
        description: 'Đại lễ Vía Đức Chí Tôn',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 1, day: 9 }
      },
      {
        id: 'le-thuong-nguon',
        title: 'Lễ Thượng Ngươn',
        description: 'Đại lễ Thượng Ngươn',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 1, day: 15 }
      },
      {
        id: 'via-thai-thuong-lao-quan',
        title: 'Đại lễ Vía Đức Thái Thượng Lão Quân',
        description: 'Đại lễ Vía Đức Thái Thượng Lão Quân',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 2, day: 15 }
      },
      {
        id: 'ky-niem-giao-tong-dac-dao',
        title: 'Kỷ niệm Đức Giáo Tông đắc đạo',
        description: 'Lễ kỷ niệm Đức Giáo Tông đắc đạo',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        lunar: { month: 2, day: 25 }
      },
      {
        id: 'ky-niem-giao-tong-tho-phong',
        title: 'Kỷ niệm Đức Giáo Tông thọ phong',
        description: 'Lễ kỷ niệm Đức Giáo Tông thọ phong',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        lunar: { month: 3, day: 13 }
      },
      {
        id: 'hung-kings',
        title: 'Giỗ Tổ Hùng Vương',
        description: 'Tưởng nhớ các vua Hùng',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 3, day: 10 }
      },
      {
        id: 'via-duc-thich-ca',
        title: 'Đại lễ Vía Đức Thích Ca',
        description: 'Đại lễ Vía Đức Thích Ca',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 4, day: 8 }
      },
      {
        id: 'liberation-day',
        title: 'Ngày Giải phóng miền Nam',
        description: 'Kỷ niệm giải phóng miền Nam, thống nhất đất nước',
        type: 'annual-solar',
        color: '#e74c3c',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        solar: { month: 4, day: 30 }
      },
      {
        id: 'labor-day',
        title: 'Ngày Quốc tế Lao động',
        description: 'Ngày Quốc tế Lao động',
        type: 'annual-solar',
        color: '#e74c3c',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        solar: { month: 5, day: 1 }
      },
      {
        id: 'sinh-nhut-giao-tong',
        title: 'Sinh nhựt Đức Giáo Tông',
        description: 'Đại lễ kỷ niệm sinh nhựt Đức Giáo Tông Nguyễn Ngọc Tương',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        lunar: { month: 5, day: 26 }
      },
      {
        id: 'le-trung-nguon',
        title: 'Đại Lễ Trung Ngươn',
        description: 'Đại lễ Trung Ngươn',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 7, day: 15 }
      },
      {
        id: 'via-duc-dieu-tri',
        title: 'Đại lễ Vía Đức Diêu Trì Kim Mẫu',
        description: 'Đại lễ Vía Đức Diêu Trì Kim Mẫu',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 8, day: 15 }
      },
      {
        id: 'national-day',
        title: 'Quốc Khánh Việt Nam',
        description: 'Kỷ niệm Quốc khánh Việt Nam',
        type: 'annual-solar',
        color: '#e74c3c',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        solar: { month: 9, day: 2 }
      },
      {
        id: 'le-ha-nguon-khai-dao',
        title: 'Đại Lễ Hạ Ngươn và kỷ niệm Khai Đạo',
        description: 'Đại lễ Hạ Ngươn và kỷ niệm Khai Đạo',
        type: 'annual-lunar',
        color: '#e67e22',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        lunar: { month: 10, day: 15 }
      },
      {
        id: 'sinh-nhut-duc-gia-to',
        title: 'Sinh nhựt Đức Gia Tô Giáo Chủ',
        description: 'Đại lễ kỷ niệm sinh nhựt Đức Gia Tô Giáo Chủ',
        type: 'annual-solar',
        color: '#e74c3c',
        textColor: '#ffffff',
        allDay: true,
        isHoliday: true,
        solar: { month: 12, day: 25 }
      }
    ];
    this.updateEvents();
  }

  // Load Tuần Cửu events from the service
  private loadTuanCuuEvents(): void {
    // We're in browser environment
    if (typeof window !== 'undefined') {

      this.tuanCuuCalendarService.getTuanCuuCalendarEvents().subscribe(events => {
        // Remove any existing Tuan Cuu events
        this.events = this.events.filter(e => e.type !== 'tuan-cuu');
        // Add new Tuan Cuu events
        this.events = [...this.events, ...events];
        this.updateEvents();
      });
    }
  }

  // Add method to refresh Tuần Cửu events (can be called after changes)
  refreshTuanCuuEvents(): void {
    this.loadTuanCuuEvents();
  }

  getMonthCalendar(year: number, month: number): CalendarDate[] {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    let startDate = new Date(firstDayOfMonth);
    const dayOfWeek = startDate.getDay();
    // Adjust for Monday as first day of week (0=Sunday, 1=Monday, etc)
    if (dayOfWeek === 0) {
      startDate.setDate(startDate.getDate() - 6); // Go back 6 days if it's Sunday
    } else {
      startDate.setDate(startDate.getDate() - (dayOfWeek - 1)); // Otherwise go back to Monday
    }
    const calendarDays: CalendarDate[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const isCurrentMonth = currentDate.getMonth() === month - 1 && currentDate.getFullYear() === year;
      const isToday = currentDate.getTime() === today.getTime();
      const lunarDate = this.getLunarDateInternal(currentDate);
      const events = this.getEventsForDate(currentDate, lunarDate);
      const calendarDate: CalendarDate = {
        solar: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
          date: currentDate,
          dayOfWeek: currentDate.getDay()
        },
        lunar: lunarDate,
        canChi: lunarDate?.canChi,
        isToday,
        isCurrentMonth,
        events
      };
      calendarDays.push(calendarDate);
    }
    return calendarDays;
  }

  private getLunarDateInternal(date: Date): { year: any; month: number; day: number; isLeapMonth: boolean, canChi: any } {
    const lunar = this.calendarService.getConvertedFullDate(date)?.convertSolar2Lunar;

    return {
      year: lunar?.lunarYearName,
      month: lunar?.lunarMonth,
      day: lunar?.lunarDay,
      isLeapMonth: lunar?.lunarLeap,
      canChi: {
        day: lunar?.lunarDayName,
        month: lunar?.lunarMonthName,
        year: lunar?.lunarYearName,
      }
    };
  }

  private getEventsForDate(date: Date, lunarDate: { year: number; month: number; day: number; isLeapMonth: boolean }): CalendarEvent[] {
    return this.events.filter((event: any) => {
      // Always show 'thanhso' events for the correct date, regardless of eventTypeVisibility
      if (event.type === 'thanhso') {
        if (event.data) {
          if (event.data.eventMonth === lunarDate.month &&
            event.data.eventDate === lunarDate.day) {
            return true;
          }
        }
        return false;
      }
      // For all other event types, respect eventTypeVisibility
      if (!this.eventTypeVisibility[event.type]) {
        return false;
      }
      switch (event.type) {
        case 'annual-solar':
          return event.solar?.month === date.getMonth() + 1 && event.solar?.day === date.getDate();
        case 'annual-lunar':
          return event.lunar?.month === lunarDate.month &&
            event.lunar?.day === lunarDate.day &&
            (event.lunar?.isLeapMonth === undefined || event.lunar.isLeapMonth === lunarDate.isLeapMonth);
        case 'monthly-solar':
          return event.solar?.day === date.getDate();
        case 'monthly-lunar':
          return event.lunar?.day === lunarDate.day;
        case 'daily':
          return true;
        case 'user':
          if (event.solar) {
            return event.solar.year === date.getFullYear() &&
              event.solar.month === date.getMonth() + 1 &&
              event.solar.day === date.getDate();
          }
          if (event.lunar) {
            return event.lunar.year === lunarDate.year &&
              event.lunar.month === lunarDate.month &&
              event.lunar.day === lunarDate.day &&
              (event.lunar.isLeapMonth === undefined || event.lunar.isLeapMonth === lunarDate.isLeapMonth);
          }
          return false;
        case 'tuan-cuu':
          // For Tuần Cửu events, check both solar and lunar dates
          if (event.solar) {
            return event.solar.year === date.getFullYear() &&
              event.solar.month === date.getMonth() + 1 &&
              event.solar.day === date.getDate();
          }
          if (event.lunar) {
            return event.lunar.year === lunarDate.year &&
              event.lunar.month === lunarDate.month &&
              event.lunar.day === lunarDate.day;
          }
          return false;
        default:
          return false;
      }
    });
  }

  addEvent(event: CalendarEvent): void {
    if (!event.id) {
      event.id = 'event-' + Date.now();
    }
    this.events.push(event);
    this.updateEvents();
  }

  updateEvent(event: CalendarEvent): void {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.events[index] = event;
      this.updateEvents();
    }
  }

  deleteEvent(id: string): void {
    this.events = this.events.filter(e => e.id !== id);
    this.updateEvents();
  }

  setEventTypeVisible(type: string, isVisible: boolean): void {
    if (this.eventTypeVisibility[type] !== undefined) {
      // Update the visibility state
      this.eventTypeVisibility[type] = isVisible;

      // Force a full calendar refresh to update all views with the new visibility setting
      this.eventsSubject.next([...this.events]);

      // Store the updated visibility settings in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('eventTypeVisibility', JSON.stringify(this.eventTypeVisibility));
      }

      // Dispatch a custom event for global communication
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('eventTypeVisibilityChange', {
          detail: { type, isVisible },
          bubbles: true
        });
        window.dispatchEvent(event);
        console.log(`Event visibility changed: ${type} = ${isVisible}`);
      }
    }
  }

  isEventTypeVisible(type: string): boolean {
    return this.eventTypeVisibility[type] !== false;
  }

  getLunarDate(date: Date): { year: any; month: number; day: number; isLeapMonth: boolean, canChi: any } {
    return this.getLunarDateInternal(date);
  }

  private updateEvents(): void {
    this.eventsSubject.next([...this.events]);
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.eventsSubject.asObservable();
  }

  formatDateRange(date: Date, view: CalendarViewType): string {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    switch (view) {
      case 'month':
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      case 'week': {
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}/${endOfWeek.getFullYear()}`;
      }
      case 'day':
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      default:
        return '';
    }
  }

  /**
   * Generate calendar data for a specific day
   * @param date The date to generate data for
   * @returns CalendarDate object with solar, lunar, and events information
   */
  generateDayData(date: Date): CalendarDate {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = this.isSameDay(date, today);

    const currentMonth = new Date();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear();

    const lunarDate = this.getLunarDateInternal(date);
    const canChi = lunarDate?.canChi;
    const events = this.getEventsForDate(date, lunarDate);

    return {
      solar: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        date: new Date(date),
        dayOfWeek: date.getDay()
      },
      lunar: lunarDate,
      canChi,
      isToday,
      isCurrentMonth,
      events
    };
  }

  /**
   * Generate calendar days for a specific week
   * @param date Any date within the desired week
   * @returns Array of CalendarDate objects for the week containing the specified date
   */
  generateWeekCalendar(date: Date): CalendarDate[] {
    const startOfWeek = this.getStartOfWeek(date);
    const weekCalendarDays: CalendarDate[] = [];

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const calendarDate = this.generateDayData(currentDate);
      weekCalendarDays.push(calendarDate);
    }

    return weekCalendarDays;
  }

  /**
   * Get the start of the week (Monday) for a given date
   */
  private getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();

    // Adjust to the previous Monday (1 is Monday in JavaScript)
    if (day === 0) {
      result.setDate(result.getDate() - 6);
    } else {
      result.setDate(result.getDate() - (day - 1));
    }

    return result;
  }

  /**
   * Check if two dates are the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  navigateToMonth(year: number, month: number): void {
    // Navigation logic for month view
  }

  navigateToWeek(year: number, month: number, day: number): void {
    // Navigation logic for week view
  }

  navigateToDay(year: number, month: number, day: number): void {
    // Navigation logic for day view
  }
}