import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import * as CryptoJS from 'crypto-js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-tinh-tuan-cuu',
  templateUrl: './tinh-tuan-cuu.component.html',
  styleUrls: ['./tinh-tuan-cuu.component.scss']
})
export class TinhTuanCuuComponent implements OnInit {

  selectedDate = {
    year: 0,
    month: 0,
    date: 0,
  };
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  tuanCuuEvents = <any>[];
  tuanCuuList = <any>[];
  displayedColumns: string[] = ['eventName', 'day', 'lunar', 'solar'];
  calculatedTuanCuu = {
    key: '',
    event: <any>[],
    date: <any>Object,
    details: {
      name: '',
      age: null,
      sex: null
    }
  }
  shareBottomSheetRef: any;
  sharedData: any;
  selectedIndex = 0

  constructor(
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private titleService: Title,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    const now = new Date()
    this.selectedDate.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.selectedDate.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.selectedDate.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
    this.getLocalStorageTuanCuu()
    this.route.queryParams.subscribe((param: any) => {
      if (param['y']) {
        this.selectedDate.year = parseInt(param['y']);
      }
      if (param['m']) {
        this.selectedDate.month = parseInt(param['m']);
      }
      if (param['d']) {
        this.selectedDate.date = parseInt(param['d']);
      }
      if (param['y'] && param['m'] && param['d']) {
        this.calculateTuanCuu()
        if (param['details']) {
          const jwtHelper = new JwtHelperService()
          const decodedToken = jwtHelper.decodeToken(param['details'])?.split('+')
          this.selectedDate = {
            date: parseInt(param['d']),
            month: parseInt(param['m']),
            year: parseInt(param['y'])
          }
          this.calculatedTuanCuu.details = {
            name: decodedToken[0],
            age: decodedToken[1],
            sex: decodedToken[2]
          }
          this.saveSharedEvent()
        }
      }
    })
    this.titleService.setTitle(`Tính Tuần Cửu | ${CONSTANT.page.name}`)
  }

  saveSharedEvent() {
    this.saveTuanCuu()
    this.selectedIndex = this.tuanCuuList.length
    if (!!location.search) {
      this.router.navigate([], {

      })
    }
  }

  getLocalStorageTuanCuu() {
    this.tuanCuuList = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    this.tuanCuuList?.forEach((item: any) => {
      item.name = `${item?.details?.name} ${item?.details?.age ? item?.details?.age + ' tuổi' : ''}`
      this.generateShareInformation(item)
      item.title = `Chia sẻ lịch cúng cửu của ${item.name}`
      const date = this.calendarService.getConvertedFullDate(new Date(`${item?.date?.year}-${item?.date?.month < 10 ? '0' + item?.date?.month : item?.date?.month}-${item?.date?.date < 10 ? '0' + item?.date?.date : item?.date?.date}`)).convertSolar2Lunar
      item.date.lunarMonth = `${date.lunarMonth} ${date.lunarLeap ? 'nhuận' : ''}`
      item.date.lunarDay = date.lunarDay
      item.date.lunarYearName = date.lunarYearName
    })
  }

  getYearOptions() {
    for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 30 }, (x, i) => i + 1)
  }

  calculateTuanCuu() {
    this.calendarService.getTuanCuuEvents(new Date(`${this.selectedDate.year}-${this.selectedDate.month < 10 ? '0' + this.selectedDate.month : this.selectedDate.month}-${this.selectedDate.date < 10 ? '0' + this.selectedDate.date : this.selectedDate.date}`))
      .subscribe((res: any) => {
        if (res) {
          res.forEach((item: any) => {
            item.day = this.commonService.convertDay(this.datePipe?.transform(item.solar, 'EEE'))
          })
          this.tuanCuuEvents = res
        }
      })
  }

  saveTuanCuu() {
    this.calculatedTuanCuu.key = this.commonService.generatedSlug(`tuancuu-${this.selectedDate.year}${this.selectedDate.month}${this.selectedDate.date}-${this.calculatedTuanCuu.details.name}`)
    this.calculatedTuanCuu.event = this.tuanCuuEvents
    this.calculatedTuanCuu.date = this.selectedDate
    if (!this.tuanCuuList?.find((item: any) => item?.key == this.calculatedTuanCuu.key)) {
      this.tuanCuuList.push(this.calculatedTuanCuu)
      this.storeTuanCuu()
    }
  }

  storeTuanCuu() {
    localStorage.setItem('tuanCuu', JSON.stringify(this.tuanCuuList))
    this.selectedDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate()
    }
    this.calculatedTuanCuu = {
      key: '',
      event: <any>[],
      date: <any>Object,
      details: {
        name: '',
        age: null,
        sex: null
      }
    }
    this.getLocalStorageTuanCuu()
  }

  deleteTuanCuu(item: any) {
    if (this.tuanCuuList?.length == 1) {
      this.tuanCuuList = []
    } else {
      let index = this.tuanCuuList.indexOf(this.tuanCuuList.find((e: any) => e.key == item.key))
      this.tuanCuuList.splice(index, 1)
    }
    this.storeTuanCuu()
  }

  generateShareInformation(item: any) {
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
    const data = `${item?.details?.name}+${item?.details?.age}+${item?.details?.sex}`;
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);
    const signature = CryptoJS.HmacSHA512("myawesomedata", "mysecretkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    item.token = token
    item.location = `${location.href}?y=${item?.date?.year}&m=${item?.date?.month}&d=${item?.date?.date}&details=${token}`
    this.cd.detectChanges()
  }
}
