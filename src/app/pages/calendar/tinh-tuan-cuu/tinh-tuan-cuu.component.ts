import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import * as CryptoJS from 'crypto-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';

@Component({
  selector: 'app-tinh-tuan-cuu',
  templateUrl: './tinh-tuan-cuu.component.html',
  styleUrls: ['./tinh-tuan-cuu.component.scss']
})
export class TinhTuanCuuComponent implements OnInit, AfterViewInit {
  print(arg0: any, _t285: HTMLElement) {
    throw new Error('Method not implemented.');
  }

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
    details: <any>{
      name: '',
      age: null,
      sex: null,
      holyName: null,
      title: null,
      subTitle: null,
      color: null,
    }
  }
  printBottomSheetRef: any;
  sharedData: any;
  selectedIndex = 0
  @ViewChild('expiriedEventDialog') expiriedEventDialog!: any;
  @ViewChild('printBottomSheet') printBottomSheet!: any;
  printedInfo: any;
  sharedUrl: any;
  caoDaiTitle = CAODAI_TITLE.data
  isHolyNameRequired: boolean = false;
  colors = <any>[
    {
      key: 'thai',
      name: 'Thái',
      color: '#fbbc05'
    },
    {
      key: 'thuong',
      name: 'Thượng',
      color: '#4285f4'
    },
    {
      key: 'ngoc',
      name: 'Ngọc',
      color: '#ea4335'
    }
  ]
  eventSummary: any;
  calculatedLunarDate: any;
  subTitles: any;

  constructor(
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private titleService: Title,
    private cd: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private matBottomSheet: MatBottomSheet
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    const now = new Date()
    this.selectedDate.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.selectedDate.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.selectedDate.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
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
          console.log(decodedToken);
          this.calculatedTuanCuu.details = {
            name: decodedToken[0] === 'empty' ? '' : decodedToken[0],
            age: decodedToken[1] === 'empty' ? null : decodedToken[1],
            sex: decodedToken[2] === 'empty' ? null : decodedToken[2],
            color: decodedToken[3] === 'empty' ? null : decodedToken[3],
            title: decodedToken[4] === 'empty' ? null : decodedToken[4],
            subTitle: decodedToken[5] === 'empty' ? null : decodedToken[5],
            holyName: decodedToken[6] === 'empty' ? null : decodedToken[6],
          }
          this.saveSharedEvent()
        }
      }
    })
    this.titleService.setTitle(`Tính Tuần Cửu | ${CONSTANT.page.name}`)
  }

  ngAfterViewInit(): void {
    this.getLocalStorageTuanCuu()
  }

  saveSharedEvent() {
    this.saveTuanCuu()
    this.selectedIndex = this.tuanCuuList.length
    if (!!location.search) {
      this.router.navigate([], {
      })
    }
  }

  expiriedEvent = <any>[];
  dialogRef: any;
  getLocalStorageTuanCuu() {
    this.tuanCuuList = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    this.expiriedEvent = this.tuanCuuList.filter((item: any) => new Date(item?.event[item?.event?.length - 1].solar) < new Date())
    if (this.expiriedEvent?.length > 0) {
      // @ts-ignore
      this.dialogRef = this.dialog.open(this.expiriedEventDialog)
    }
    this.tuanCuuList?.forEach((item: any) => {
      console.log(item);
      let selectedTitle: any = this.caoDaiTitle.find((v: any) => v.key === item.details.title);
      item.tab = `${selectedTitle && item.details.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[item.details.sex] : ''} ${this.subTitles?.find((v: any) => v?.key === item.details.subTitle)?.name || ''} ${item.details.holyName ? `${selectedTitle?.name} ${item.details.holyName} (${item.details.name})` : item.details.name} ${item.details.age ? item.details.age + ' tuổi' : ''}`
      item.name = `${selectedTitle?.eventTitle || 'cúng'} cửu cho ${selectedTitle && item.details.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[item.details.sex] : ''} ${this.subTitles?.find((v: any) => v?.key === item.details.subTitle)?.name || ''} ${item.details.holyName ? `${selectedTitle?.name} ${item.details.holyName} (${item.details.name})` : item.details.name} ${item.details.age ? item.details.age + ' tuổi' : ''}`
      this.generateShareInformation(item)
      item.title = `Chia sẻ lịch ${selectedTitle?.eventTitle || 'cúng'} cửu cho ${selectedTitle && item.details.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[item.details.sex] : ''} ${this.subTitles?.find((item: any) => item?.key === item.details.subTitle)?.name || ''} ${item.details.holyName ? `${selectedTitle?.name} ${item.details.holyName} (${item.details.name})` : item.details.name} ${item.details.age ? item.details.age + ' tuổi' : ''}`
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
      details: <any>{
        name: '',
        age: null,
        sex: null,
        holyName: null,
        title: null,
        subTitle: null,
        color: null,
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
    const data = `${item?.details?.name || 'empty'}+${item?.details?.age || 'empty'}+${item?.details?.sex || 'empty'}+${item?.details?.color || 'empty'}+${item?.details?.title || 'empty'}+${item?.details?.subTitle || 'empty'}+${item?.details?.holyName || 'empty'}`;
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    item.token = token
    item.location = `${location.href}?y=${item?.date?.year}&m=${item?.date?.month}&d=${item?.date?.date}&details=${token}`
    this.cd.detectChanges()
  }

  deleteAllExpiriedEvent() {
    this.expiriedEvent.forEach((item: any) => {
      this.deleteTuanCuu(item)
      this.dialogRef.close()
    })
  }

  onCallPrint(item: any) {
    this.printedInfo = item
    this.printBottomSheetRef = this.matBottomSheet.open(this.printBottomSheet)
  }

  onPrint(item: any, parent?: any) {
    let parentElement = null
    parentElement = parent.qrcElement.nativeElement
      .querySelector("canvas")
      .toDataURL("image/png")
    console.log(parentElement);
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      `<html><head>
      <title>${document.title.toUpperCase()}PRINTER</title>
      <style>
      .tableContent td, th {
        font-size: 22px;
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid #000000;
      }
      </style>
      `
    );
    printTab?.document.write('</head><body >');
    console.log(item);

    const information = `
    <h2 style="text-align: center;">LỊCH ${item.name?.toUpperCase()}</h2>
    <h3 style="text-align: center;">
    TỪ TRẦN NGÀY ${item?.date?.lunarDay} THÁNG ${item?.date?.lunarMonth} NĂM ${item?.date?.lunarYearName?.toUpperCase()} (${this.decimalPipe.transform(item.date.date, '2.0-0')}/${this.decimalPipe.transform(item.date.month, '2.0-0')}/${item.date.year})
    </h3>`

    const printContent = document.getElementById(
      `${item?.key}`
    );
    const caodaiOnInFo = `<div>
    <div style="float: left; width: 50%">
    <p><strong>Truy Cập</strong> <a href="https://www.caodaion.com">https://www.caodaion.com</a> để tính lịch cúng tuần cửu tự động</p>
    <p style="text-align: center">hoặc</p>
    <p><strong>Quét mã QR ngay</strong> để đồng bộ lịch cúng cửu của ${item?.name}</p>
    </div>
    <div style="float: right; width: 50%; text-align: right">
    <img src="${parentElement}" height="300px" width="300px" />
    </div>
    </div>`
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      // @ts-ignore
      writeContent.innerHTML = `${information}${printContent?.outerHTML}${caodaiOnInFo}`;
      // @ts-ignore
      if (writeContent.childNodes[0] && writeContent.childNodes[0].style) {
        // @ts-ignore
        writeContent.childNodes[0].style.padding = 0;
      }
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }

  onUpdateInfomation() {
    this.isHolyNameRequired = this.caoDaiTitle.find((item: any) => item.key === this.calculatedTuanCuu.details.title)?.isHolyNameRequired || false
    let selectedTitle: any = this.caoDaiTitle.find((item: any) => item.key === this.calculatedTuanCuu.details.title);
    this.subTitles = []
    if (selectedTitle?.subTitle) {
      this.subTitles = selectedTitle?.subTitle
    }
    if (this.calculatedTuanCuu.details.name) {
      if (this.isHolyNameRequired) {
        if (this.calculatedTuanCuu.details.sex === 'male') {
          if (this.calculatedTuanCuu.details.color) {
            this.calculatedTuanCuu.details.holyName = `${this.colors.find((item: any) => item.key === this.calculatedTuanCuu.details.color)?.name} ${this.calculatedTuanCuu.details.name?.split(' ')[this.calculatedTuanCuu.details.name?.split(' ').length - 1]} Thanh`
          }
        }
        if (this.calculatedTuanCuu.details.sex === 'female') {
          this.calculatedTuanCuu.details.holyName = `Hương ${this.calculatedTuanCuu.details.name?.split(' ')[this.calculatedTuanCuu.details.name?.split(' ').length - 1]}`
        }
      }
    }
    this.eventSummary = `Lịch ${selectedTitle?.eventTitle || 'cúng'} cửu cho ${selectedTitle && this.calculatedTuanCuu.details.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[this.calculatedTuanCuu.details.sex] : ''} ${this.subTitles.find((item: any) => item?.key === this.calculatedTuanCuu.details.subTitle)?.name || ''} ${this.calculatedTuanCuu.details.holyName ? `${selectedTitle?.name} ${this.calculatedTuanCuu.details.holyName} (${this.calculatedTuanCuu.details.name})` : this.calculatedTuanCuu.details.name} ${this.calculatedTuanCuu.details.age ? this.calculatedTuanCuu.details.age + ' tuổi' : ''}`
    const calculatedLunarDate = this.calendarService.getConvertedFullDate(new Date(`${this.selectedDate?.year}-${this.selectedDate?.month < 10 ? '0' + this.selectedDate?.month : this.selectedDate?.month}-${this.selectedDate?.date < 10 ? '0' + this.selectedDate?.date : this.selectedDate?.date}`)).convertSolar2Lunar
    this.calculatedLunarDate = `${calculatedLunarDate.lunarDay}/${calculatedLunarDate.lunarMonth < 10 ? '0' + calculatedLunarDate.lunarMonth : calculatedLunarDate.lunarMonth}${calculatedLunarDate.lunarLeap ? 'N' : ''}/${calculatedLunarDate.lunarYearName}`
  }
}
