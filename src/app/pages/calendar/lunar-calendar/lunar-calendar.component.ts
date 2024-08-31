import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, findIndex, tap } from 'rxjs';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import * as CryptoJS from "crypto-js";
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxCaptureService } from 'ngx-capture';

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
  currentUser: any;
  calendarMode = 'month';
  viewPortMode = 'desktop';
  guestMessage = '';
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
  lunarTimeZone = TIME_TYPE.data
  suggetExpand: boolean = false;
  setting = <any>{};

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
    private matBottomSheet: MatBottomSheet,
    private captureService: NgxCaptureService,
    private authService: AuthService
  ) {
  }



  ngOnInit(): void {
    this.guestMessage = 'Bổ sung lịch'
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

    });
  }

  getThanhSoInMember() {
    if (this.filter?.yellow) {
      if (!localStorage?.getItem('memberThanhSo')) {
        this.expaned = true
        this.guestMessage = 'Bạn có thể chọn Thánh Sở để hiển thị lịch hành đạo và các sự kiện tại Thánh Sở của bạn tại đây. Nếu bạn chưa thấy Thánh Sở của bạn. Hãy Đăng ký thành viên lịch để các sự kiện tại Thánh Sở của bạn sẽ hiển thị trên lịch của CaoDaiON nhé!'
        this.suggetExpand = true
      } else {
        this.selectedThanhSo = localStorage?.getItem('memberThanhSo')
        this.getThanhSoEvent()
      }
    }
  }

  ngAfterViewInit(): void {
    this.getTuThoiTimes();
    this.changeDetector.detectChanges();
    this.authService.getCurrentUser()
      .subscribe((res: any) => {
        this.currentUser = res
        this.onChangeCalendarMode(this.calendarMode, this.selectedDate);
        if (new Date().getHours() > 22) {
          this.currentDate?.solar.setDate(this.currentDate?.solar.getDate() + 1);
        }
        this.monthSelectValue =
          this.selectedDate.solar?.getMonth() + 1 < 10
            ? '0' + (this.selectedDate.solar?.getMonth() + 1)
            : (this.selectedDate.solar?.getMonth() + 1).toString();
        this.getThanhSoInMember()
      })
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
        if (this.filter?.consecutive) {
          let data = <any>[];
          var now = new Date();
          const startDate = this.currentUser.congPhu[0].dateTime
          for (var d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const dateValue = new Date(d);
            const foundDate = this.currentUser.congPhu?.find((item: any) => item?.dateTime?.toString() == dateValue?.toString())
            const focusArray = foundDate?.data?.map((item: any) => item?.focus)
            const focusSum = focusArray?.reduce((a: any, b: any) => a + b, 0)
            const qualityArray = foundDate?.data?.map((item: any) => item?.quality)
            const qualitySum = qualityArray?.reduce((a: any, b: any) => a + b, 0)
            let averageFocus = (focusSum / focusArray?.length) || 0
            let qualityFocus = (qualitySum / qualityArray?.length) || 0
            data.push({
              date: new Date(d),
              data: foundDate?.data || [],
              averageFocus: averageFocus,
              qualityFocus: qualityFocus,
            });
          }
          const foundConsecutive = data?.find((cp: any) => {
            return new Date(cp?.date?.setHours(0))?.toString() === date?.solar?.toString()
          })
          date.logged = foundConsecutive?.data?.length
        }
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
                case 'yearly-03-13':
                  soTemplate = flyss?.event.key.includes('thoi-ty') ? 'so-le-ky-niem-duc-giao-tong-tho-phong-thoi-ty' : flyss?.event.key.includes('thoi-ngo') ? 'so-le-ky-niem-duc-giao-tong-tho-phong-thoi-ngo' : '';
                  eventName = flyss?.event.key.includes('thoi-ty') ? 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Thọ Phong (Thời Tý)' : flyss?.event.key.includes('thoi-ngo') ? 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Thọ Phong (Thời NGỌ)' : '';
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
    if (this.filter?.yellow) {
      this.mergeLocalStorageEvents()
    }
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
            if (!date.event?.find((de: any) => de.name == foundEvent.eventName)) {
              date.event.push({ event: foundEvent, details: tuanCuu?.details, date: tuanCuu?.date })
            }
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
    if (!event?.event?.soTemplate) {
      if (event.event.name?.includes('Cầu Siêu')) {
        event.event.soTemplate = 'so-cau-sieu'
        event.event.longSo = 'tam-tran'
        event.event.eventLunar = event.event.lunar
        if (event.event.name?.includes('Cửu')) {
          const split = event.event.name?.split(' ')
          const cuuIndex = split.indexOf('Cửu')
          event.event.eventName = `${split[cuuIndex - 1]} Cửu chi tuần`
        }
        event.event.subject = <any>{}
        event.event.subject.details = event?.details
        event.event.subject.date = event?.date
      }
    }
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

  updateSelectedThanhSo(event: any) {
    this.selectedThanhSo = event
    if (!this.selectedThanhSo) {
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
    localStorage.setItem('memberThanhSo', this.selectedThanhSo || '')
  }

  selectedThanhSoSetting = <any>{}
  getThanhSoEvent() {
    if (this.selectedThanhSo) {
      this.eventService.fetchThanhSoEvent(this.selectedThanhSo)
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.selectedThanhSoSetting = res.setting
            this.selectedThanhSoEvents = res.data
            this.refresh = true
            this.mergeThanhSoEvent()
          }
        })
    } else {
      this.selectedThanhSoSetting = <any>{}
      this.selectedThanhSoEvents = <any>[]
      this.changeDetector.detectChanges()
    }
  }

  mergeThanhSoEvent() {
    if (this.calendarMode === 'month') {
      const data = this.selectedThanhSoEvents.map((item: any) => {
        if (typeof item?.data == 'string') {
          item.data = JSON.parse(item?.data)
        }
        const foundTitle = CAODAI_TITLE.data.find((ft: any) => ft.key == item?.data?.title)
        let name = ''
        let eventAddress: any;
        let solar: any;
        let lunar: any;
        let eventName: any;
        let eventLunar: any;
        let longSo: any;
        let soTemplate: any;
        let subject: any;
        if (item.eventType?.includes('ky-niem')) {
          longSo = 'tam-tran'
          soTemplate = 'so-cau-sieu'
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
              "lunarDay": item?.data.eventDate,
              "lunarMonth": item?.data.eventMonth,
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
            lunar.lunarTime = item?.data?.eventTime
            subject = {
              date: {
                lunarYear: item?.data?.year || '',
                lunarMonth: item?.data?.month || '',
                lunarDay: item?.data?.date || '',
                lunarTime: item?.data?.time?.split(' |')[0] || '',
              },
              details: {
                name: item?.data?.name,
                age: item?.data?.age,
                sex: item?.data?.sex,
                holyName: item?.data?.holyName,
                title: foundTitle?.key,
                job: item?.data?.job,
                color: this.commonService.generatedSlug(item?.data?.color || ''),
                province: item?.data?.address?.province,
                district: item?.data?.address?.district,
                ward: item?.data?.address?.ward,
                address: item?.data?.address?.address,
              },
              key: item['Timestamp']
            }
          }
          eventName = `Kỷ Niệm chi nhựt`
          name = item?.eventName
          eventAddress = item?.data?.eventAddress
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
          eventAddress: eventAddress,
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
    if (this.shownDate?.event?.event?.key && typeof this.shownDate?.event?.event?.key === 'string') {
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
  shareItem = <any>{}
  shareBottomSheetRef: any;
  @ViewChild('shareBottomSheet') shareBottomSheet!: any;
  vegetarianBottomSheetRef: any;
  @ViewChild('vegetarianBottomSheet') vegetarianBottomSheet!: any;
  showShareImage() {
    this.shareItem = <any>{}
    this.shareItem.traiGioi = true
    this.updateShareInformation()
    this.shareBottomSheetRef = this.matBottomSheet.open(this.shareBottomSheet)
  }

  updateShareInformation() {
    this.shareItem.date = this.shownDate?.date
    this.shareItem.name = this.shownDate.event?.event?.name
    if (!this.shareItem.time) this.shareItem.time = this.shownDate?.event?.date
    if (this.shareItem.time) {
      if (typeof this.shareItem.time == 'string') {
        this.shareItem.id = this.shareItem.time
      }
      const selectedEvent = this.shareItem.options?.find((item: any) => item.key == this.shareItem.time)
      this.shareItem.name = selectedEvent?.data?.name || this.shownDate.event?.event?.name
      this.shareItem.targetEvent = selectedEvent?.data?.name || `${this.lunarTimeZone?.find((item: any) => item?.name?.includes(this.shareItem?.date?.event[0]?.event?.eventLunar?.lunarTime))?.name} (${this.shareItem.time?.time})`
      if (selectedEvent?.data?.name.includes(this.shareItem.name)) {
        this.shareItem.targetEvent = null
      }
    } else {
      if (this.shownDate?.event?.mainEventKey) {
        this.shareItem.event = <any>{}
        this.shareItem.event.date = 'yearly-'
        this.shareItem.id = this.shownDate?.event?.mainEventKey
        const nameSplit = this.shownDate?.event?.event?.name?.split('|')?.length > 1 ? this.shownDate?.event?.event?.name?.split('|')[1] : this.shownDate?.event?.event?.name?.split('thời')[0]
        this.shareItem.name = nameSplit
        if (this.shownDate?.event?.mainEventKey.includes('soc') || this.shownDate?.event?.mainEventKey.includes('vong')) {
          if (this.shownDate.event.event.eventLunar?.lunarMonth) {
            this.shareItem.name += `tháng ${this.decimal.transform(this.shownDate.event.event.eventLunar?.lunarMonth, '2.0-0')}`
          }
          this.shareItem.event.date = 'yearly-monthly-'
        }
        this.shareItem.options = this.shownDate?.date?.event?.map((item: any) => {
          return {
            key: item?.event?.key,
            data: item?.event,
          }
        })
      } else {
        if (this.shareItem?.date?.event) {
          this.shareItem.targetEvent = this.lunarTimeZone?.find((item: any) => item?.name?.includes(this.shareItem?.date?.event[0]?.event?.eventLunar?.lunarTime))?.name
        }
      }
    }
    if (!this.shareItem.id) {
      this.shareItem.id = this.shownDate.event.event.key
    }
  }
  downloading: boolean = false

  saveAsImage(element: any) {
    const content = document.getElementById(element.id)?.textContent
    navigator.clipboard.writeText(content || '')
    setTimeout(() => {
      this.downloading = true
      const saveItem = document.getElementById(element.id)
      this.captureService
        //@ts-ignore
        .getImage(saveItem, true)
        .pipe(
          tap((img: string) => {
            // converts base 64 encoded image to blobData
            let blobData = this.convertBase64ToBlob(img)
            // saves as image
            const blob = new Blob([blobData], { type: "image/png" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            // name of the file
            link.download = `${element?.id?.toString()?.replace('.', '_')}`
            link.click()
            this.downloading = false
          })
        )
        .subscribe();
    }, 0)
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  vegetarianDay: any;

  shareVegetarianDay(item: any) {
    this.vegetarianDay = item;
    this.vegetarianBottomSheetRef = this.matBottomSheet.open(this.vegetarianBottomSheet)
  }
}

export class DateFormatModel {
  solar?: any;
  lunar?: any;
  event?: any;
}
