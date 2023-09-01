import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';

@Component({
  selector: 'app-lunar-calendar',
  templateUrl: './lunar-calendar.component.html',
  styleUrls: [
    './lunar-calendar.component.scss',
    './styles/date-calendar.lunar-calendar.component.scss',
    './styles/date-hours.date-calendar.lunar-calendar.component.scss',
    './styles/selected-month.lunar-calendar.component.scss',
    './styles/dates.selected-month.lunar-calendar.component.scss',
  ]
})
export class LunarCalendarComponent implements OnInit, AfterViewInit {
  selectedDate = new DateFormatModel();
  selectedMonth: any[] = [];
  currentDate = {
    solar: new Date(),
  };
  dateRange: any[] = [];
  eventList = this.eventService.eventList;
  eventSummaryDialogRef: any;
  shownDate: any;
  calendarMode = 'month';
  viewPortMode = 'desktop';
  commonDateTimeValue = this.commonService.commonDates;
  monthSelectValue: any = this.selectedDate.solar?.getMonth();
  time = this.commonService.time;
  tuThoiZone: any[] = [];

  constructor(
    private calendarService: CalendarService,
    private commonService: CommonService,
    private eventService: EventService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Lịch | ${CONSTANT.page.name}`)
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.viewPortMode = 'mobile';
        } else {
          this.viewPortMode = 'desktop';
        }
      });
    this.route.queryParams.subscribe((param: any) => {
      if (param['m']) {
        this.calendarMode = param['m'];
      } else {
        this.calendarMode = 'day';
      }
      if (param['s']) {
        this.selectedDate.solar = new Date(param['s']);
        if (!new Date(param['s'])) {
          this.selectedDate.solar = new Date();
        }
        this.selectedDate.lunar = this.calendarService.getConvertedFullDate(
          this.selectedDate.solar
        );
      } else {
        this.selectedDate.solar = new Date();
        this.selectedDate.lunar = this.calendarService.getConvertedFullDate(
          this.selectedDate.solar
        );
      }
      this.calendarService.calendarViewMode = this.calendarMode;
      this.onChangeCalendarMode(this.calendarMode, this.selectedDate);
      this.getCalendarEvent();
      if (new Date().getHours() > 22) {
        this.currentDate?.solar.setDate(this.currentDate?.solar.getDate() + 1);
      }
      this.monthSelectValue =
        this.selectedDate.solar?.getMonth() + 1 < 10
          ? '0' + (this.selectedDate.solar?.getMonth() + 1)
          : (this.selectedDate.solar?.getMonth() + 1).toString();
    });
  }

  ngAfterViewInit(): void {
    this.getTuThoiTimes();
    this.changeDetector.detectChanges();
  }

  getTuThoiTimes() {
    if (this.calendarMode === 'day') {
      this.tuThoiZone = [];
      const startTy = new Date(new Date().setHours(23, 0, 0));
      const endTy = new Date(new Date().setHours(0, 59, 59));
      const startMeo = new Date(new Date().setHours(5, 0, 0));
      const endMeo = new Date(new Date().setHours(6, 59, 59));
      const startNgo = new Date(new Date().setHours(11, 0, 0));
      const endNgo = new Date(new Date().setHours(12, 59, 59));
      const startDau = new Date(new Date().setHours(17, 0, 0));
      const endDau = new Date(new Date().setHours(18, 59, 59));
      this.tuThoiZone = [
        {
          startTime: startTy,
          position: this.getPosition(startTy),
          height: this.getPosition(endTy) - this.getPosition(startTy),
        },
        {
          startTime: startMeo,
          position: this.getPosition(startMeo),
          height: this.getPosition(endMeo) - this.getPosition(startMeo),
        },
        {
          startTime: startNgo,
          position: this.getPosition(startNgo),
          height: this.getPosition(endNgo) - this.getPosition(startNgo),
        },
        {
          startTime: startDau,
          position: this.getPosition(startDau),
          height: this.getPosition(endDau) - this.getPosition(startDau),
        },
      ];
    }
  }

  onChangeSelectedCalendar(action: any, date?: any) {
    if (this.calendarMode === 'month') {
      if (action === 'next') {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setMonth(
            this.selectedDate.solar.getMonth() + 1
          )
        );
        this.monthSelectValue =
          this.selectedDate.solar?.getMonth() + 1 < 10
            ? '0' + (this.selectedDate.solar?.getMonth() + 1)
            : (this.selectedDate.solar?.getMonth() + 1).toString();
      }
      if (action === 'before') {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setMonth(
            this.selectedDate.solar.getMonth() - 1
          )
        );
        this.monthSelectValue =
          this.selectedDate.solar?.getMonth() + 1 < 10
            ? '0' + (this.selectedDate.solar?.getMonth() + 1)
            : (this.selectedDate.solar?.getMonth() + 1).toString();
      }
      if (parseInt(date)) {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setMonth(parseInt(date) - 1)
        );
      }
    }
    if (this.calendarMode === 'day') {
      if (parseInt(date)) {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setMonth(parseInt(date) - 1)
        );
      }
      if (action === 'next') {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setDate(this.selectedDate.solar.getDate() + 1)
        );
      }
      if (action === 'before') {
        this.selectedDate.solar = new Date(
          this.selectedDate.solar.setDate(this.selectedDate.solar.getDate() - 1)
        );
      }
    }
    if (action === 'current') {
      this.selectedDate.solar = new Date();
    }
    this.selectedMonth = this.calendarService.getSelectedMonthCalendar(
      this.selectedDate.solar.getMonth() + 1,
      this.selectedDate.solar.getFullYear()
    );
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { s: this.selectedDate.solar.toDateString() },
      queryParamsHandling: 'merge',
    });
    this.getCalendarEvent();
  }

  dateEvents: any[] = [];

  getCalendarEvent() {
    let tuthoi: any[] = [];
    let yearlyMonthlySpecial: any[] = [];
    let yearlySpecialSpecial: any[] = [];

    this.eventList.forEach((item: any) => {
      item.event.forEach((event: any) => {
        // yearly-monthly-daily
        if (
          event.date === 'yearly-monthly-daily' &&
          event.key.includes('cung-thoi')
        ) {
          tuthoi.push({ mainEventKey: item.key, event });
        }
        // yearly-monthly-special
        if (
          event.date !== 'yearly-monthly-daily' &&
          event.date?.includes('yearly-monthly-')
        ) {
          yearlyMonthlySpecial.push({ mainEventKey: item.key, event });
        }
        // yearly-special-special
        if (
          event.date !== 'yearly-monthly-daily' &&
          !event.date?.includes('yearly-monthly-') &&
          event.date?.includes('yearly-')
        ) {
          yearlySpecialSpecial.push({ mainEventKey: item.key, event });
        }
      }
      )
    }
    );

    let comparedTime = new Date();
    if (new Date().getHours() > 22) {
      comparedTime = new Date(new Date().setDate(new Date().getDate() + 1));
    }
    if (this.calendarMode === 'month') {
      this.selectedMonth.forEach((date: any) => {
        if (
          date.solar.getDate() === comparedTime.getDate() &&
          date.solar.getMonth() === comparedTime.getMonth() &&
          date.solar.getFullYear() === comparedTime.getFullYear()
        ) {
          date.event = tuthoi;
        }
        let foundLunaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
          (item: any) =>
            parseInt(item.event.date.split('-')[2]) ===
            date.lunar.convertSolar2Lunar.lunarDay &&
            item.event.dateType === 'lunar'
        );
        if (foundLunaryearlyMonthlySpecial?.length > 0) {
          date.event = foundLunaryearlyMonthlySpecial;
        }
        let foundSolaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
          (item: any) =>
            parseInt(item.event.date.split('-')[2]) === date.solar.getDate() &&
            item.event.dateType === 'solar'
        );
        if (foundSolaryearlyMonthlySpecial?.length > 0) {
          date.event = foundSolaryearlyMonthlySpecial;
        }

        let foundLunaryearlySpecialSpecial = yearlySpecialSpecial.filter(
          (item: any) =>
            parseInt(item.event.date.split('-')[1]) ===
            date.lunar.convertSolar2Lunar.lunarMonth &&
            parseInt(item.event.date.split('-')[2]) ===
            date.lunar.convertSolar2Lunar.lunarDay &&
            item.event.dateType === 'lunar'
        );
        if (foundLunaryearlySpecialSpecial?.length > 0) {
          date.event = foundLunaryearlySpecialSpecial;
        }

        let foundSolaryearlySpecialSpecial = yearlySpecialSpecial.filter(
          (item: any) =>
            parseInt(item.event.date.split('-')[1]) ===
            date.solar.getUTCMonth() + 1 &&
            parseInt(item.event.date.split('-')[2]) === date.solar.getDate() &&
            item.event.dateType === 'solar'
        );
        if (foundSolaryearlySpecialSpecial?.length > 0) {
          date.event = foundSolaryearlySpecialSpecial;
        }
      });
    }
    if (this.calendarMode === 'day') {
      this.dateEvents = [];
      this.selectedDate.event = [];
      if (
        this.selectedDate.solar.getDate() === comparedTime.getDate() &&
        this.selectedDate.solar.getMonth() === comparedTime.getMonth() &&
        this.selectedDate.solar.getFullYear() === comparedTime.getFullYear()
      ) {
        this.selectedDate.event = tuthoi;
      }
      let foundLunaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
        (item: any) =>
          parseInt(item.event.date.split('-')[2]) ===
          this.selectedDate.lunar.convertSolar2Lunar.lunarDay &&
          item.event.dateType === 'lunar'
      );
      if (foundLunaryearlyMonthlySpecial?.length > 0) {
        this.selectedDate.event = foundLunaryearlyMonthlySpecial;
      }
      let foundSolaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
        (item: any) =>
          parseInt(item.event.date.split('-')[2]) ===
          this.selectedDate.solar.getDate() && item.event.dateType === 'solar'
      );
      if (foundSolaryearlyMonthlySpecial?.length > 0) {
        this.selectedDate.event = foundSolaryearlyMonthlySpecial;
      }
      let foundLunaryearlySpecialSpecial = yearlySpecialSpecial.filter(
        (item: any) =>
          parseInt(item.event.date.split('-')[1]) ===
          this.selectedDate.lunar.convertSolar2Lunar.lunarMonth &&
          parseInt(item.event.date.split('-')[2]) ===
          this.selectedDate.lunar.convertSolar2Lunar.lunarDay &&
          item.event.dateType === 'lunar'
      );
      if (foundLunaryearlySpecialSpecial?.length > 0) {
        this.selectedDate.event = foundLunaryearlySpecialSpecial;
      }

      let foundSolaryearlySpecialSpecial = yearlySpecialSpecial.filter(
        (item: any) =>
          parseInt(item.event.date.split('-')[1]) ===
          this.selectedDate.solar.getUTCMonth() + 1 &&
          parseInt(item.event.date.split('-')[2]) ===
          this.selectedDate.solar.getDate() &&
          item.event.dateType === 'solar'
      );
      if (foundSolaryearlySpecialSpecial?.length > 0) {
        this.selectedDate.event = foundSolaryearlySpecialSpecial;
      }
      this.selectedDate.event?.forEach((item: any) => {
        let newDate = new Date();
        newDate.setHours(
          parseInt(item.event.time[0].split('-')[1].substring(0, 2))
        );
        newDate.setMinutes(0);
        let pushedEvent = {
          timeZone: {
            key: item.event.time[0],
            start: newDate,
            end: item.event.time[0].split('-')[1].substring(2, 2),
          },
          event: [item],
        };
        let existTimeZone = this.dateEvents.find(
          (event: any) => event.timeZone.key === item.event.time[0]
        );
        if (!!existTimeZone) {
          existTimeZone.event.push(item);
        } else {
          this.dateEvents.push(pushedEvent);
        }
      });
    }
    this.mergeLocalStorageEvents()
    console.log(this.dateEvents);
  }

  mergeLocalStorageEvents() {
    const tuanCuuEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    tuanCuuEvents?.forEach((tuanCuu: any) => {
      if (this.calendarMode === 'month') {
        this.selectedMonth.forEach((date: any) => {
          const foundEvent = tuanCuu?.event.find((item: any) => {
            return new Date(item?.solar).getDate() == new Date(date?.solar).getDate() &&
              new Date(item?.solar).getMonth() == new Date(date?.solar).getMonth() &&
              new Date(item?.solar).getFullYear() == new Date(date?.solar).getFullYear()
          })
          if (foundEvent) {
            foundEvent.eventName = `Cầu siêu ${foundEvent.eventName} cho ${tuanCuu?.details?.name}`
            if (!date.event || date.event?.length == 0) {
              date.event = []
            }
            date.event.push({ event: foundEvent })
          }
        })
      }
    })
  }

  openEventSummaryDialog(date: any, event: any, eventSummayDialog: any) {
    if (!event?.event?.name) {
      event.event.name = event?.event?.eventName
    }
    if (!event?.event?.date) {
      event.event.date = `${event?.event?.day} ngày ${event?.event?.lunar?.lunarDay} tháng ${event?.event?.lunar?.lunarMonth} năm ${event?.event?.lunar?.lunarYearName} (${this.datePipe.transform(event?.event?.solar, 'dd/MM/YYYY')})`
    }
    this.shownDate = { date, event };
    this.eventSummaryDialogRef = this.matDialog.open(eventSummayDialog);
  }

  getTimes(time: any): Array<any> {
    return time?.map((item: any) =>
      this.commonService.commonTimes.find((time: any) => time.key === item)
    );
  }

  getLocationTypes(locationType: any): Array<any> {
    if (locationType?.includes('all')) {
      locationType = ['all'];
    }
    return locationType?.map((item: any) =>
      this.commonService.commonLocationTypes.find(
        (locationType: any) => locationType.key === item
      )
    );
  }

  onGetKinhFromSummaryEvent() {
    this.router.navigate(['/trang-chu/kinh'], {
      queryParams: {
        me: this.shownDate.event.mainEventKey,
        e: this.shownDate.event.event.key,
      },
    });
  }

  getCurrentDate(date: any): boolean {
    return (
      date?.solar?.getDate() === this.currentDate?.solar?.getDate() &&
      date?.solar?.getMonth() === this.currentDate?.solar?.getMonth() &&
      date?.solar?.getFullYear() === this.currentDate?.solar?.getFullYear()
    );
  }

  onChangeCalendarMode(mode: any, date: any) {
    this.calendarMode = mode;
    if (this.calendarMode === 'month') {
      this.selectedMonth = this.calendarService.getSelectedMonthCalendar(
        this.selectedDate.solar.getMonth() + 1,
        this.selectedDate.solar.getFullYear()
      );
      this.calendarService.calendarViewMode = mode;
    }
    if (this.calendarMode === 'day') {
      this.selectedDate = date;
      let startOfDate = new Date(this.selectedDate.solar);
      startOfDate.setDate(startOfDate.getDate() - 1);
      startOfDate.setHours(23, 0, 0, 0);
      let endOfDate = new Date(this.selectedDate.solar);
      endOfDate.setHours(22, 59, 59, 999);
      this.dateRange = [];
      for (
        let ho = startOfDate;
        ho <= endOfDate;
        ho.setMinutes(ho.getMinutes() + 1)
      ) {
        const minute = {
          year: ho.getFullYear(),
          month: ho.getMonth() + 1,
          date: ho.getDate(),
          hour: ho.getHours(),
          munite: ho.getMinutes(),
        };
        this.dateRange.push(minute);
      }
      this.calendarService.calendarViewMode = mode;
      setTimeout(() => {
        this.getTuThoiTimes();
      }, 0);
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { m: mode, s: this.selectedDate.solar.toDateString() },
      queryParamsHandling: 'merge',
    });
  }

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  swipe(e: any, when: any) {
    const coord: [number, number] = [
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY,
    ];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      let direction: any[] = [];
      if (this.swipeCoord) {
        direction = [
          coord[0] - this.swipeCoord[0],
          coord[1] - this.swipeCoord[1],
        ];
      }
      let duration: any;
      if (this.swipeTime) {
        duration = time - this.swipeTime;
      }
      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'before';
        // Do whatever you want with swipe
        this.onChangeSelectedCalendar(swipe);
      }
    }
  }

  getPosition(time: any) {
    if (time) {
      const currentTimeId = `h${time?.getHours() < 10 ? '0' + time?.getHours() : time?.getHours()
        }m${time?.getMinutes() < 10 ? '0' + time?.getMinutes() : time?.getMinutes()
        }`;
      const dateRange = document.getElementById('dateRange');
      const dateRangeOffset: any = dateRange?.getBoundingClientRect();
      const currentTimeMinute = document.getElementById(currentTimeId);
      const currentTimeMinuteOffset: any =
        currentTimeMinute?.getBoundingClientRect().top;
        return currentTimeMinuteOffset - dateRangeOffset?.top;
    }
    return 0
  }

  onMouseWheel(event: any) {
    if (event?.srcElement?.nodeName !== 'MAT-LIST-ITEM' && event?.srcElement?.nodeName !== 'MAT-LIST' && event?.srcElement?.nodeName !== 'SPAN') {
      if (event.wheelDelta > 0) {
        if (this.calendarMode === 'month') {
          this.onChangeSelectedCalendar('before')
        }
      }
      if (event.wheelDelta < 0) {
        if (this.calendarMode === 'month') {
          this.onChangeSelectedCalendar('next')
        }
      }
    }
  }
}

export class DateFormatModel {
  solar?: any;
  lunar?: any;
  event?: any;
}
