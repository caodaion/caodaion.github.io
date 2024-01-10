import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewChecked,
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
import { Observable } from 'rxjs';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import * as CryptoJS from "crypto-js";
import { JwtHelperService } from '@auth0/angular-jwt';

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
export class LunarCalendarComponent implements OnInit, AfterViewInit, AfterViewChecked {
  selectedDate = new DateFormatModel();
  selectedMonth: any[] = [];
  currentDate = {
    solar: new Date(),
  };
  dateRange: any[] = [];
  eventList = this.eventService.eventList;
  eventSummaryDialogRef: any;
  shownDate: any;
  currentUser: any;
  calendarMode = 'month';
  viewPortMode = 'desktop';
  expaned = false;
  refresh = true;
  updateThanhSoEvent = false;
  allowToUpdateMember: any;
  commonDateTimeValue = this.commonService.commonDates;
  monthSelectValue: any = this.selectedDate.solar?.getMonth();
  time = this.commonService.time;
  tuThoiZone: any[] = [];
  memberThanhSo: any[] = [];
  selectedThanhSoEvents: any[] = [];
  filter = <any>{
    six: true,
    red: true,
    blue: true,
    yellow: true,
    white: true,
  };
  selectedThanhSo: any = null;

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
    private datePipe: DatePipe,
    private decimal: DecimalPipe,
    private authService: AuthService
  ) {
  }

  ngAfterViewChecked(): void {
    if (this.eventService.isActiveMemberThanhSoList && this.memberThanhSo?.length === 0) {
      const memberThanhSo = localStorage.getItem('memberThanhSo')
      if (memberThanhSo !== 'null') {
        this.selectedThanhSo = memberThanhSo
      }
      this.getMemberThanhSo()
    }
    if (this.selectedThanhSo && this.filter?.yellow) {
      if (this.eventService.isActiveSelectedThanhSo && this.selectedThanhSoEvents?.length === 0 && this.refresh) {
        this.getThanhSoEvent()
      }
    }
  }

  getMemberThanhSo() {
    this.eventService.getMemberThanhSo()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.memberThanhSo = [{ key: 'null', thanhSo: 'Chọn Thánh Sở của bạn' }].concat(res.data)
          this.currentUser = this.authService.getCurrentUser()
          this.allowToUpdateMember = this.memberThanhSo.find((item: any) => item.updatePremissionFor === this.currentUser?.userName)
          if (this.selectedThanhSo) {
            this.getThanhSoEvent()
          }
        }
      })
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
        this.calendarMode = 'month';
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
      const calendarFilter = JSON.parse(localStorage.getItem('calendarFilter') || 'null')
      if (calendarFilter) {
        this.filter = calendarFilter
      }
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
    let comparedTime = new Date();
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
    });
    if (new Date().getHours() > 22) {
      comparedTime = new Date(new Date().setDate(new Date().getDate() + 1));
    }
    if (this.calendarMode === 'month') {
      this.selectedMonth.forEach((date: any) => {
        if (this.filter?.white) {
          if (
            date.solar.getDate() === comparedTime.getDate() &&
            date.solar.getMonth() === comparedTime.getMonth() &&
            date.solar.getFullYear() === comparedTime.getFullYear()
          ) {
            date.event = tuthoi;
          }
        }
        if (this.filter?.blue) {

          let foundLunaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
            (item: any) =>
              parseInt(item.event.date.split('-')[2]) ===
              date.lunar.convertSolar2Lunar.lunarDay &&
              item.event.dateType === 'lunar'
          );
          if (foundLunaryearlyMonthlySpecial?.length > 0) {
            if (date?.lunar?.convertSolar2Lunar?.lunarDay === 1 || date?.lunar?.convertSolar2Lunar?.lunarDay === 15) {
              foundLunaryearlyMonthlySpecial?.forEach((flms: any) => {
                const soTemplate = flms?.event.key.includes('thoi-ty') ? 'so-soc-vong-thoi-ty' : flms?.event.key.includes('thoi-ngo') ? 'so-soc-vong-thoi-ngo' : ''
                const eventName = flms?.event.key.includes('thoi-ty') ? 'Sớ Sóc Vọng (Thời Tý)' : flms?.event.key.includes('thoi-ngo') ? 'Sớ Sóc Vọng (Thời Ngọ)' : ''
                if (soTemplate) {
                  if (flms?.event.key.includes('thoi-ngo')) {
                    date.lunar.convertSolar2Lunar.lunarTime = 'NGỌ'
                  }
                  flms.event.longSo = 'tam-giao';
                  flms.event.soTemplate = soTemplate;
                  flms.event.eventName = eventName;
                  flms.event.eventLunar = date?.lunar?.convertSolar2Lunar;
                }
              })
            }
            date.event = foundLunaryearlyMonthlySpecial;
          }
        }
        let foundSolaryearlyMonthlySpecial = yearlyMonthlySpecial.filter(
          (item: any) =>
            parseInt(item.event.date.split('-')[2]) === date.solar.getDate() &&
            item.event.dateType === 'solar'
        );
        if (foundSolaryearlyMonthlySpecial?.length > 0) {
          date.event = foundSolaryearlyMonthlySpecial;
        }
        if (this.filter?.red) {
          let foundLunaryearlySpecialSpecial = yearlySpecialSpecial.filter(
            (item: any) =>
              parseInt(item.event.date.split('-')[1]) ===
              date.lunar.convertSolar2Lunar.lunarMonth &&
              parseInt(item.event.date.split('-')[2]) ===
              date.lunar.convertSolar2Lunar.lunarDay &&
              item.event.dateType === 'lunar'
          );
          if (foundLunaryearlySpecialSpecial?.length > 0) {
            foundLunaryearlySpecialSpecial.forEach((flyss: any) => {
              let soTemplate = '';
              let eventName = '';
              switch (flyss?.event.date) {
                case 'yearly-01-01':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-nguon-dan-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-nguon-dan-thoi-ty' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Ngươn Đán (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Ngươn Đán (Thời Ngọ)' : '';
                  break;
                case 'yearly-01-09':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-via-duc-ngoc-hoang-thuong-de-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-via-duc-ngoc-hoang-thuong-de-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Vía Đức Ngọc-Hoàng Thượng Đế (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Vía Đức Ngọc-Hoàng Thượng Đế (Thời Ngọ)' : '';
                  break;
                case 'yearly-01-15':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-thuong-nguon-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-thuong-nguon-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Thượng Ngươn (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Thượng Ngươn (Thời Ngọ)' : '';
                  break;
                case 'yearly-02-15':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-via-duc-thai-thuong-lao-quan-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-via-duc-thai-thuong-lao-quan-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Vía Đức Thái Thượng Lão Quân (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Vía Đức Thái Thượng Lão Quân (Thời Ngọ)' : '';
                  break;
                case 'yearly-02-25':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-ky-niem-duc-giao-tong-dac-dao-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-ky-niem-duc-giao-tong-dac-dao-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Đắc Đạo (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Đắc Đạo (Thời Ngọ)' : '';
                  break;
                case 'yearly-04-08':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-via-duc-phat-to-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-via-duc-phat-to-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Vía Đức Phật Tổ (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Vía Đức Phật Tổ (Thời Ngọ)' : '';
                  break;
                case 'yearly-05-26':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-ky-niem-sanh-nhat-duc-giao-tong-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-ky-niem-sanh-nhat-duc-giao-tong-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Kỷ Niệm Sanh Nhật Đức Giáo Tông (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Kỷ Niệm Sanh Nhật Đức Giáo Tông (Thời Ngọ)' : '';
                  break;
                case 'yearly-07-15':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-trung-nguon-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-trung-nguon-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Trung Ngươn (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Trung Ngươn (Thời Ngọ)' : '';
                  break;
                case 'yearly-08-15':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-via-duc-dieu-tri-kim-mau-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-via-duc-dieu-tri-kim-mau-thoi-ngo-cung-cac-thanh-that' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Vía Đức Diêu Trì Kim Mẫu (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Vía Đức Diêu Trì Kim Mẫu (Thời Ngọ) (Cúng các Thánh Thất) ' : '';
                  break;
                case 'yearly-10-15':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-ha-nguon-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-ha-nguon-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Hạ Ngươn (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Hạ Ngươn (Thời Ngọ)' : '';
                  break;
                default:
                  break;
              }
              if (soTemplate) {
                flyss.event.longSo = 'tam-giao';
                flyss.event.soTemplate = soTemplate;
                flyss.event.eventName = eventName;
                flyss.event.eventLunar = date?.lunar?.convertSolar2Lunar;
                if (flyss?.event.key.includes('thoi-ngo')) {
                  flyss.event.eventLunar.lunarTime = 'NGỌ'
                }
                if (flyss?.event.key.includes('thoi-ty')) {
                  flyss.event.eventLunar.lunarTime = 'TÝ'
                }
              }
            })
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
            foundSolaryearlySpecialSpecial?.forEach((fsyss: any) => {
              const soTemplate = fsyss?.event.key.includes('thoi-ty') ? 'so-le-sanh-nhut-duc-gia-to-giao-chu-thoi-ty' : fsyss?.event.key.includes('thoi-ngo') ? 'so-le-sanh-nhut-duc-gia-to-giao-chu-thoi-ngo' : '';
              const eventName = fsyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Sanh Nhựt Đức Gia Tô Giáo Chủ (Thời Tý)' : fsyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Sanh Nhựt Đức Gia Tô Giáo Chủ (Thời Ngọ)' : '';
              if (soTemplate) {
                fsyss.event.longSo = 'tam-giao';
                fsyss.event.soTemplate = soTemplate;
                fsyss.event.eventName = eventName;
                fsyss.event.eventLunar = date?.lunar?.convertSolar2Lunar;
                if (fsyss?.event.key.includes('thoi-ngo')) {
                  fsyss.event.eventLunar.lunarTime = 'NGỌ'
                }
                if (fsyss?.event.key.includes('thoi-ty')) {
                  fsyss.event.eventLunar.lunarTime = 'TÝ'
                }
              }
            })
          }
        }
        if (date.event?.length > 0 && date.event[0]) {
          if (date.event[0]?.mainEventKey !== 'cung-tu-thoi') {
            date.six = true
            date.ten = true
            date.fifteen = true
          }
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
    if (this.selectedThanhSoEvents?.length > 0) {
      this.mergeThanhSoEvent()
    }
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
            const foundTitle = CAODAI_TITLE.data.find((cdontt: any) => cdontt.key === tuanCuu.details.title)
            foundEvent.eventName = `${foundTitle?.eventTitle} ${foundEvent.eventName} cho ${foundTitle?.name} ${tuanCuu.details.holyName ? tuanCuu.details.holyName + " - " + tuanCuu.details.name : tuanCuu.details.name}`
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
      event.event.date = `${event?.event?.day || ''} ngày ${event?.event?.lunar?.lunarDay} tháng ${event?.event?.lunar?.lunarMonth} năm ${event?.event?.lunar?.lunarYearName} (${this.datePipe.transform(event?.event?.solar, 'dd/MM/YYYY')})`
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
    this.router.navigate(['/kinh'], {
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
    this.getCalendarEvent()
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

  syncToGoogleCalendar() {
    console.log(this.shownDate);
    const data = JSON.parse(JSON.stringify(this.shownDate?.event?.event))
    if (data) {
      if (data.solar) {
        const request = {
          text: data.name,
          dates: [new Date(data.solar), new Date(new Date(new Date(data.solar).toJSON()).setHours(new Date(data.solar).getHours() + 1))],
          subTitle: ''
        }
        const url = this.calendarService.getGoogleCalendarEventEditUrl(request)
        window.open(url, '_blank')
      } else {
        if (data.dateType === 'lunar') {
          if (data?.time[0] === 'ty-2301' || data?.time[0] === 'meo-0507' || data?.time[0] === 'ngo-1113' || data?.time[0] === 'dau-1719') {
            const startDate = `${JSON.parse(JSON.stringify(data.time[0])).split('-')[0]}-${JSON.parse(JSON.stringify(data.time[0])).split('-')[1].slice(0, 2)}-${JSON.parse(JSON.stringify(data.time[0])).split('-')[1].slice(-2)}`
            const request = <any>{
              text: data.name,
              dates: [startDate],
              subTitle: ''
            }
            if (data.date === 'yearly-monthly-daily') {
              request.recur = 'RRULE:FREQ=DAILY'
            }
            if (data.date.match(new RegExp('yearly-[0-9][0-9]-[0-9][0-9]')) || data.date.match(new RegExp('yearly-monthly-[0-9][0-9]'))) {
              console.log(parseInt(data?.time[0].split('-').slice(0, 2)));
              let startDateV = new Date(new Date(JSON.parse(JSON.stringify(this.shownDate.date.solar))).setHours(parseInt(data?.time[0].split('-')[1].slice(0, 2))))
              let endDateV = new Date(new Date(JSON.parse(JSON.stringify(this.shownDate.date.solar))).setHours(parseInt(data?.time[0].split('-')[1].slice(-2))))
              if (data?.time[0] === 'ty-2301') {
                startDateV = new Date(startDateV.setDate(startDateV.getDate() - 1))
              }
              request.dates = [startDateV, endDateV]
            }
            const url = this.calendarService.getGoogleCalendarEventEditUrl(request)
            window.open(url, '_blank')
          }
        }
      }
    }
  }

  isActiveMoreInformation(): boolean {
    if (this.memberThanhSo?.length > 0) {
      return true
    }
    return false
  }

  updateSelectedThanhSo() {
    if (this.selectedThanhSo == 'null') {
      this.refresh = false
      this.selectedThanhSoEvents = []
      this.onChangeSelectedCalendar('month');
      this.mergeThanhSoEvent()
    } else {
      this.filter.yellow = true;
      this.getThanhSoEvent()
    }
    this.updateUserInfor()
  }

  updateUserInfor() {
    localStorage.setItem('memberThanhSo', this.selectedThanhSo)
  }

  getThanhSoEvent() {
    if (this.selectedThanhSo) {
      this.eventService.getSelectedThanhSo({ key: this.selectedThanhSo })
        .subscribe((res: any) => {
          if (res.code === 200) {
            this.selectedThanhSoEvents = res.data
            this.refresh = true
            this.mergeThanhSoEvent()
          }
        })
    }
  }

  mergeThanhSoEvent() {
    if (this.calendarMode === 'month') {
      const data = this.selectedThanhSoEvents.map((item: any) => {
        const foundTitle = CAODAI_TITLE.data.find((ft: any) => ft.name == item?.eventTargetTitle)
        let name = ''
        let solar: any;
        let lunar: any;
        let eventName: any;
        let eventLunar: any;
        let longSo: any;
        let soTemplate: any;
        let subject: any;
        if (item.eventType?.includes('Kỷ Niệm')) {
          longSo = 'tam-tran'
          soTemplate = 'so-cau-sieu'
          let holyName = ''
          if (foundTitle?.isHolyNameRequired) {
            if (item?.gender == 'Nam') {
              holyName = `${item.color} ${item?.eventTargetName.split(' ')[item?.eventTargetName.split(' ').length - 1]} Thanh`
            } else {
              holyName = `Hương ${item?.eventTargetName.split(' ')[item?.eventTargetName.split(' ').length - 1]}`
            }
          }
          if (!item?.isSolarEvent) {
            const newYearTime = this.calendarService.getConvertedFullDate({
              "lunarDay": 1,
              "lunarMonth": 1,
              "lunarYear": new Date().getFullYear(),
            }).convertLunar2Solar
            let operationYear = new Date().getFullYear()
            if (new Date() < new Date(`${newYearTime[2]}-${this.decimal.transform(newYearTime[1], '2.0-0')}-${this.decimal.transform(newYearTime[0], '2.0-0')}`)) {
              operationYear -= 1
            }
            eventLunar = {
              "lunarDay": item?.date,
              "lunarMonth": item?.month,
              "lunarYear": operationYear,
            }
            const convertLunar2Solar = this.calendarService.getConvertedFullDate(eventLunar).convertLunar2Solar
            solar = new Date(`${convertLunar2Solar[2]}-${this.decimal.transform(convertLunar2Solar[1], '2.0-0')}-${this.decimal.transform(convertLunar2Solar[0], '2.0-0')}`)
            if (item?.thoi) {
              const foundThoi = TIME_TYPE.data.find((tt: any) => tt.name.includes(item?.thoi))?.key
              const startDate = `${JSON.parse(JSON.stringify(foundThoi)).split('-')[0]}-${JSON.parse(JSON.stringify(foundThoi)).split('-')[1].slice(0, 2)}-${JSON.parse(JSON.stringify(foundThoi)).split('-')[1].slice(-2)}`
              solar = new Date(solar.setHours(startDate.split('-')[1]))
            }
            lunar = this.calendarService.getConvertedFullDate(solar).convertSolar2Lunar
            subject = {
              date: {
                lunarYear: item?.eventTargetYear || '',
                lunarMonth: item?.eventTargetMonth || '',
                lunarDay: item?.eventTargetDate || '',
                lunarTime: item?.eventTargetThoi?.split(' |')[0] || '',
                solarYear: item?.eventTargetYearSolar || '',
              },
              details: {
                name: item.eventTargetName,
                age: item.eventTargetAge,
                sex: item.gender == 'Name' ? 'male' : 'female',
                holyName: holyName,
                title: foundTitle?.key,
                subTitle: null,
                color: this.commonService.generatedSlug(item.color || ''),
              },
              key: item['Timestamp']
            }
          }
          eventName = `Kỷ Niệm chi nhựt`
          name = `${foundTitle?.eventTitle} Kỷ Niệm cho ${item?.jobType ? item?.jobType : (item?.eventTargetTitle?.includes('Chưa có Đạo') ? '' : item?.eventTargetTitle)} ${holyName || item.eventTargetName}`
        }
        return {
          key: item['Timestamp'],
          name: name,
          solar: solar?.toISOString(),
          lunar: lunar,
          parent: this.selectedThanhSo,
          eventLunar: lunar,
          longSo: longSo,
          soTemplate: soTemplate,
          eventName: eventName,
          subject: subject
        }
      })
      this.selectedMonth.forEach((date: any) => {
        const foundEvent = data?.filter((item: any) => {
          return new Date(item?.solar).getDate() == new Date(date?.solar).getDate() &&
            new Date(item?.solar).getMonth() == new Date(date?.solar).getMonth() &&
            new Date(item?.solar).getFullYear() == new Date(date?.solar).getFullYear()
        })
        if (foundEvent?.length > 0) {
          foundEvent?.forEach((fe: any) => {
            if (!date.event || date.event?.length == 0) {
              date.event = []
            }
            if (!date.event?.find((de: any) => de.event.key == fe.key)) {
              date.event.push({ event: fe })
            }
          })
        }
      })
    }
  }

  onOpenSoanSo() {
    const data = this.shownDate?.event?.event
    if (this.shownDate?.event?.event?.key?.includes('thoi-ngo')) {
      this.shownDate.event.event.eventLunar.lunarTime = 'NGỌ'
    }
    if (this.shownDate?.event?.event?.key?.includes('thoi-ty')) {
      this.shownDate.event.event.eventLunar.lunarTime = 'TÝ'
    }
    if (this.shownDate?.event?.event?.key?.includes('thoi-meo')) {
      this.shownDate.event.event.eventLunar.lunarTime = 'MẸO'
    }
    if (this.shownDate?.event?.event?.key?.includes('thoi-dau')) {
      this.shownDate.event.event.eventLunar.lunarTime = 'DẬU'
    }
    this.generateToken(data)
      .subscribe((tk: any) => {
        this.router.navigateByUrl(`/tac-vu/phong-le/soan-so/${tk}`)
      })
  }

  generateToken(item: any) {
    return new Observable((observable: any) => {
      const base64url = (source: any) => {
        let encodedSource = CryptoJS.enc.Base64.stringify(source);
        encodedSource = encodedSource.replace(/=+$/, '');
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');
        return encodedSource;
      }
      const header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
      const encodedHeader = base64url(stringifiedHeader);
      const data = item;
      const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
      const encodedData = base64url(stringifiedData);
      const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
      const encodedSignature = btoa(signature);
      const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
      observable.next(token)
    })
  }

  updatefliter() {
    this.refresh = this.filter?.yellow
    this.selectedThanhSoEvents = []
    localStorage.setItem('calendarFilter', JSON.stringify(this.filter));
    this.onChangeCalendarMode(this.calendarMode, this.selectedDate);
  }
}

export class DateFormatModel {
  solar?: any;
  lunar?: any;
  event?: any;
}
