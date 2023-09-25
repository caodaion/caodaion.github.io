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
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LocationService } from 'src/app/shared/services/location/location.service';

@Component({
  selector: 'app-tinh-tuan-cuu',
  templateUrl: './tinh-tuan-cuu.component.html',
  styleUrls: ['./tinh-tuan-cuu.component.scss']
})
export class TinhTuanCuuComponent implements OnInit, AfterViewInit {
  provinces = <any>[]
  districts = <any>[]
  filteredDistricts = <any>[]
  wards = <any>[]
  filteredWards = <any>[]
  selectedDate = <any>{
    year: 0,
    month: 0,
    date: 0,
    time: null,
    lunarTime: null
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
  shareBottomSheetRef: any;
  sharedData: any;
  selectedIndex = 0
  @ViewChild('expiriedEventDialog') expiriedEventDialog!: any;
  @ViewChild('printBottomSheet') printBottomSheet!: any;
  @ViewChild('shareBottomSheet') shareBottomSheet!: any;
  printedInfo: any;
  shareItem = <any>{};
  timeZone = <any>[];
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
  provinceFilter: any;
  downloading: boolean = false
  isShowDownLoadImage: boolean = false
  isShowButtonSetDefault: boolean = false

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
    private matBottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver,
    private captureService: NgxCaptureService,
    private locationService: LocationService
  ) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isShowDownLoadImage = true
        } else {
          this.isShowDownLoadImage = false;
        }
      });
    this.getYearOptions()
    const now = new Date()
    this.selectedDate.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.selectedDate.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.selectedDate.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
    this.selectedDate.time = this.datePipe.transform(now, 'HH:mm')
    this.getCalculatedLunarDate()
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
            province: decodedToken[7] === 'empty' ? null : decodedToken[7],
            district: decodedToken[8] === 'empty' ? null : decodedToken[8],
            ward: decodedToken[9] === 'empty' ? null : decodedToken[9],
            address: decodedToken[10] === 'empty' ? null : decodedToken[10],
          }
          this.saveSharedEvent()
        }
      }
    })
    this.titleService.setTitle(`Tính Tuần Cửu | ${CONSTANT.page.name}`)
    this.getAllDivisions()
    this.getDistricts()
    this.getWards()
  }

  ngAfterViewInit(): void {
    this.getLocalStorageTuanCuu()
  }

  getAllDivisions() {
    this.provinces = this.locationService.provinces
    try {
      this.locationService.getAllDivisions()
        .subscribe((res: any) => {
          if (res?.length > 0) {
            this.provinces = res
            this.locationService.provinces = res
          }
        })
    } catch (e) {
      console.log(e);
    }
  }

  getDistricts() {
    this.districts = this.locationService.districts
    if (!this.districts || this.districts?.length === 0) {
      try {
        this.locationService.getDistricts()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.districts = res
              this.locationService.districts = res
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredDistricts = this.districts?.filter((item: any) => item.province_code === this.calculatedTuanCuu.details.province)
    }
  }

  getWards() {
    this.wards = this.locationService.wards
    if (!this.wards || this.wards?.length === 0) {
      try {
        this.locationService.getWards()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.wards = res
              this.locationService.wards = res
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredWards = this.wards?.filter((item: any) => item.district_code === this.calculatedTuanCuu.details.district)
    }
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
    for (let i = new Date().getFullYear() + 1; i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 31 }, (x, i) => i + 1)
  }

  calculateTuanCuu() {
    let calDate = new Date(`${this.selectedDate.year}-${this.selectedDate.month < 10 ? '0' + this.selectedDate.month : this.selectedDate.month}-${this.selectedDate.date < 10 ? '0' + this.selectedDate.date : this.selectedDate.date}T${this.selectedDate?.time ? this.selectedDate?.time + ':00' : '00:00:00'}`)
    if (calDate > new Date(new Date(calDate).setHours(22, 59, 59))) {
      calDate = new Date(new Date(calDate.setDate(calDate.getDate() + 1)).setHours(0, 0, 0))
    }
    this.calendarService.getTuanCuuEvents(calDate)
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
    localStorage.setItem('tuanCuu', JSON.stringify(this.tuanCuuList?.map((item: any) => {
      return {
        key: item.key,
        date: item.date,
        details: item.details,
        event: item.event,
      }
    })))
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
    const data = `${item?.details?.name || 'empty'}+${item?.details?.age || 'empty'}+${item?.details?.sex || 'empty'}+${item?.details?.color || 'empty'}+${item?.details?.title || 'empty'}+${item?.details?.subTitle || 'empty'}+${item?.details?.holyName || 'empty'}+${item?.details?.province || 'empty'}+${item?.details?.district || 'empty'}+${item?.details?.ward || 'empty'}+${item?.details?.address || 'empty'}`;
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
      .btn-share-item {
        display: none;
      }
      </style>
      `
    );
    printTab?.document.write('</head><body >');
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
    this.getCalculatedLunarDate()
  }

  getCalculatedLunarDate() {
    const calculatedLunarDate = this.calendarService.getConvertedFullDate(new Date(`${this.selectedDate?.year}-${this.selectedDate?.month < 10 ? '0' + this.selectedDate?.month : this.selectedDate?.month}-${this.selectedDate?.date < 10 ? '0' + this.selectedDate?.date : this.selectedDate?.date}T${this.selectedDate?.time ? this.selectedDate?.time + ':00' : '00:00:00'}`)).convertSolar2Lunar
    this.selectedDate.lunarTime = calculatedLunarDate?.lunarTime || ''
    this.calculatedLunarDate = `${calculatedLunarDate.lunarTime ? 'Thời ' + calculatedLunarDate.lunarTime : ''} | ${calculatedLunarDate.lunarDay < 10 ? '0' + calculatedLunarDate.lunarDay : calculatedLunarDate.lunarDay}/${calculatedLunarDate.lunarMonth < 10 ? '0' + calculatedLunarDate.lunarMonth : calculatedLunarDate.lunarMonth}${calculatedLunarDate.lunarLeap ? 'N' : ''}/${calculatedLunarDate.lunarYearName}`
  }

  showShareImage(element: any, item: any) {
    this.shareItem = {
      element, item
    }
    this.timeZone = TIME_TYPE.data
    let localStorageEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    const foundCurrentEvent = localStorageEvents.find((lc: any) => lc.key === this.shareItem.item.key)
    if (foundCurrentEvent.defaultTime) {
      this.shareItem.time = foundCurrentEvent.defaultTime
      this.isShowButtonSetDefault = false
    } else {
      this.shareItem.time = 'DẬU | 17:00-19:00'
      this.isShowButtonSetDefault = true
    }
    this.shareItem.id = this.commonService
      .generatedSlug(`${this.shareItem?.element?.eventName} ${this.datePipe
        .transform(this.shareItem?.element?.solar, 'YYYYMMdd')}` || 'caodaion-qr')
    this.shareBottomSheetRef = this.matBottomSheet.open(this.shareBottomSheet)
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

  saveAsImage(element: any) {
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
            link.download = `${element.id}`
            link.click()
            this.downloading = false
          })
        )
        .subscribe();
    }, 0)
  }

  setDefaultTimeForEvent() {
    let localStorageEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    const foundCurrentEvent = localStorageEvents.find((item: any) => item.key === this.shareItem.item.key)
    localStorageEvents[localStorageEvents.indexOf(foundCurrentEvent)].defaultTime = this.shareItem.time
    localStorage.setItem('tuanCuu', JSON.stringify(localStorageEvents))
    this.isShowButtonSetDefault = false
  }
}
