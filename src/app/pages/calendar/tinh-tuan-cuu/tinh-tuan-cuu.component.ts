import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import * as CryptoJS from 'crypto-js';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-tinh-tuan-cuu',
  templateUrl: './tinh-tuan-cuu.component.html',
  styleUrls: ['./tinh-tuan-cuu.component.scss']
})
export class TinhTuanCuuComponent implements OnInit {

  selectedDate = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
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
    private matBottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    this.getLocalStorageTuanCuu()
    this.route.queryParams.subscribe((param: any) => {
      if (param['y']) {
        this.selectedDate.lunarYear = parseInt(param['y']);
      }
      if (param['m']) {
        this.selectedDate.lunarMonth = parseInt(param['m']);
      }
      if (param['d']) {
        this.selectedDate.lunarDay = parseInt(param['d']);
      }
      if (param['y'] && param['m'] && param['d']) {
        this.calculateTuanCuu()
        if (param['details']) {
          const jwtHelper = new JwtHelperService()
          const decodedToken = jwtHelper.decodeToken(param['details'])?.split('+')
          this.selectedDate = {
            lunarDay: parseInt(param['d']),
            lunarMonth: parseInt(param['m']),
            lunarYear: parseInt(param['y']),
            lunarLeap: 0,
            lunarYearName: this.yearOptions?.find((item: any) => item?.solar == parseInt(param['y']))?.lunar
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
  }

  getLocalStorageTuanCuu() {
    this.tuanCuuList = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    this.tuanCuuList?.forEach((item: any) => {
      item.name = `${item?.details?.name} ${item?.details?.age ? item?.details?.age + ' tuổi' : ''}`
      this.generateShareInformation(item)
      item.title = `Chia sẻ lịch cúng cửu của ${item.name}`
    })
    console.log(this.tuanCuuList);

  }

  getYearOptions() {
    for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        lunar: convertedDate.convertSolar2Lunar.lunarYearName,
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 30 }, (x, i) => i + 1)
  }

  calculateTuanCuu() {
    this.calendarService.getTuanCuuEvents(this.selectedDate)
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
    this.calculatedTuanCuu.key = this.commonService.generatedSlug(`tuancuu-${this.selectedDate.lunarYear}${this.selectedDate.lunarMonth}${this.selectedDate.lunarDay}-${this.calculatedTuanCuu.details.name}`)
    this.calculatedTuanCuu.event = this.tuanCuuEvents
    this.calculatedTuanCuu.date = this.selectedDate
    this.tuanCuuList.push(this.calculatedTuanCuu)
    this.storeTuanCuu()
  }

  storeTuanCuu() {
    localStorage.setItem('tuanCuu', JSON.stringify(this.tuanCuuList))
    this.selectedDate = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
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
    item.location = `${location.href}?y=${item?.date?.lunarYear}&m=${item?.date?.lunarMonth}&d=${item?.date?.lunarDay}&details=${token}`
  }
}
