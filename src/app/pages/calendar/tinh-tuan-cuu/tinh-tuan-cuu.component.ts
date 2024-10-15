import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import * as QRCode from 'qrcode'
import html2canvas from 'html2canvas-pro';
import * as CryptoJS from "crypto-js";

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
    private matBottomSheet: MatBottomSheet
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    const now = new Date()
    this.selectedDate.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.selectedDate.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.selectedDate.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
    this.selectedDate.time = this.datePipe.transform(now, 'HH:mm')
    this.getCalculatedLunarDate()
    this.route.params.subscribe((param: any) => {
      console.log(param);
      
      if (param.year) {
        this.selectedDate.year = parseInt(param.year);
      }
      if (param.month) {
        this.selectedDate.month = parseInt(param.month);
      }
      if (param.date) {
        this.selectedDate.date = parseInt(param.date);
      }
      if (param.year && param.month && param.date) {
        this.calculateTuanCuu()
        if (param.details) {
          const jwtHelper = new JwtHelperService()
          console.log(jwtHelper.decodeToken(param.details));
          const decodedToken = JSON.parse(jwtHelper.decodeToken(param.details) || '[]')
          console.log(decodedToken);
          
          this.selectedDate = {
            time: param.time?.replace('-', ':'),
            date: parseInt(param.date),
            month: parseInt(param.month),
            year: parseInt(param.year)
          }
          this.getCalculatedLunarDate()
          this.calculatedTuanCuu.details = {
            name: decodedToken[0],
            age: decodedToken[1],
            sex: decodedToken[2],
            color: decodedToken[3],
            title: decodedToken[4],
            subTitle: decodedToken[5],
            holyName: decodedToken[6],
            province: decodedToken[7],
            district: decodedToken[8],
            ward: decodedToken[9],
            address: decodedToken[10],
          }
          this.saveSharedEvent()
        }
      }
    })
    this.titleService.setTitle(`Tính Tuần Cửu | ${CONSTANT.page.name}`)
    this.getAllDivisions()
  }

  ngAfterViewInit(): void {
    this.getLocalStorageTuanCuu()
  }

  getAllDivisions() {
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
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
    const newDate = new Date()
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
      item?.event?.forEach((ev: any) => {
        if (new Date(ev.solar) < newDate) {
          ev.isShowSync = false
        } else {
          ev.isShowSync = true
        }
      })
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
      return CryptoJS.enc.Base64.stringify(source)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    const header = {
      "alg": "HS256",
      "typ": "JWT"
    };

    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));

    const sourcedata = [
      item?.details?.name,
      item?.details?.age,
      item?.details?.sex,
      item?.details?.color,
      item?.details?.title,
      item?.details?.subTitle,
      item?.details?.holyName,
      item?.details?.province,
      item?.details?.district,
      item?.details?.ward,
      item?.details?.address
    ].map(value => value || '');

    const encodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(sourcedata)));
    
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);

    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    
    item.token = token;
    item.location = `${location.href}/${item?.date?.year}/${this.decimalPipe.transform(item?.date?.month, '2.0-0')}/${this.decimalPipe.transform(item?.date?.date, '2.0-0')}/${item?.date?.time?.replace(':', '-')}/${token}`;
    
    this.cd.detectChanges();
  }

  deleteAllExpiriedEvent() {
    this.expiriedEvent.forEach((item: any) => {
      this.deleteTuanCuu(item)
      this.dialogRef.close()
    })
  }

  onCallPrint(item: any) {
    this.printedInfo = item
    QRCode.toDataURL(this.printedInfo?.location)
      .then(url => {
        this.printedInfo.qrData = url;
      })
      .catch(err => {
        console.error(err);
      });
    this.printBottomSheetRef = this.matBottomSheet.open(this.printBottomSheet)
  }

  onPrint(item: any, parent?: any) {
    let parentElement = null
    parentElement = this.printedInfo?.qrData
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
        font-size: 21px;
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
    const caodaiOnInFo = `<div style="display: flex;">
    <div style="float: left; width: 50%">
    <p><strong>Truy Cập</strong> <a href="https://www.caodaion.com">https://www.caodaion.com</a> để tính lịch cúng tuần cửu tự động</p>
    <p style="text-align: center">hoặc</p>
    <p><strong>Quét mã QR ngay</strong> để đồng bộ lịch cúng ${item?.name}</p>
    </div>
    <div style="float: right; width: 45%; text-align: right">
    <img loading="lazy" src="${parentElement}" style="width: 80%; object-fit: contain; margin-top: 5px" />
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

  onUpdateInformation() {
    const selectedTitle = this.caoDaiTitle.find((item: any) => item.key === this.calculatedTuanCuu.details.title);
    this.isHolyNameRequired = selectedTitle?.isHolyNameRequired || false;
    this.subTitles = selectedTitle?.subTitle || [];

    if (this.calculatedTuanCuu.details.name && this.isHolyNameRequired) {
      const lastName = this.calculatedTuanCuu.details.name.split(' ').pop();
      if (this.calculatedTuanCuu.details.sex === 'male' && this.calculatedTuanCuu.details.color) {
        const colorName = this.colors.find((item: any) => item.key === this.calculatedTuanCuu.details.color)?.name;
        this.calculatedTuanCuu.details.holyName = `${colorName} ${lastName} Thanh`;
      } else if (this.calculatedTuanCuu.details.sex === 'female') {
        this.calculatedTuanCuu.details.holyName = `Hương ${lastName}`;
      }
    }

    const subTitleName = this.subTitles.find((item: any) => item?.key === this.calculatedTuanCuu.details.subTitle)?.name || '';
    const howToAddress = selectedTitle?.howToAddress && this.calculatedTuanCuu.details.sex
      ? (selectedTitle.howToAddress as Record<string, string>)[this.calculatedTuanCuu.details.sex]
      : '';
    const nameDisplay = this.calculatedTuanCuu.details.holyName 
      ? `${selectedTitle?.name} ${this.calculatedTuanCuu.details.holyName} (${this.calculatedTuanCuu.details.name})`
      : this.calculatedTuanCuu.details.name;
    const ageDisplay = this.calculatedTuanCuu.details.age ? `${this.calculatedTuanCuu.details.age} tuổi` : '';

    this.eventSummary = `Lịch ${selectedTitle?.eventTitle || 'cúng'} cửu cho ${howToAddress} ${subTitleName} ${nameDisplay} ${ageDisplay}`.trim();
    
    this.getCalculatedLunarDate();
  }

  getCalculatedLunarDate() {
    const date = new Date(
      this.selectedDate.year,
      this.selectedDate.month - 1,
      this.selectedDate.date,
      ...((this.selectedDate.time || '00:00').split(':').map(Number))
    );
    const calculatedLunarDate = this.calendarService.getConvertedFullDate(date).convertSolar2Lunar;
    
    this.selectedDate.lunarTime = calculatedLunarDate?.lunarTime || '';
    this.calculatedLunarDate = [
      calculatedLunarDate.lunarTime ? `Thời ${calculatedLunarDate.lunarTime}` : '',
      [
        calculatedLunarDate.lunarDay.toString().padStart(2, '0'),
        calculatedLunarDate.lunarMonth.toString().padStart(2, '0') + (calculatedLunarDate.lunarLeap ? 'N' : ''),
        calculatedLunarDate.lunarYearName
      ].join('/')
    ].filter(Boolean).join(' | ');
  }

  showShareImage(element: any, item: any) {
    this.shareItem = { element, item };
    this.timeZone = TIME_TYPE.data;
    const localStorageEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]');
    const foundCurrentEvent = localStorageEvents.find((lc: any) => lc.key === this.shareItem.item.key);

    this.shareItem.time = element?.lunar?.lunarTime || foundCurrentEvent?.defaultTime || 'DẬU | 17:00-19:00';
    this.isShowButtonSetDefault = !foundCurrentEvent?.defaultTime;

    this.shareItem.id = this.commonService.generatedSlug(
      `${this.shareItem?.element?.eventName} ${this.datePipe.transform(this.shareItem?.element?.solar, 'YYYYMMdd')}` || 'caodaion-qr'
    );
    this.shareBottomSheetRef = this.matBottomSheet.open(this.shareBottomSheet);
  }

  private convertBase64ToBlob(Base64Image: string) {
    const [metadata, base64] = Base64Image.split(';base64,');
    const contentType = metadata.split(':')[1];
    const byteCharacters = atob(base64);
    const byteArrays = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([byteArrays], { type: contentType });
  }

  saveAsImage(element: any) {
    this.downloading = true;
    const saveItem = document.getElementById(element.id);
    if (saveItem) {
      html2canvas(saveItem)
        .then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${this.commonService.generatedSlug(element.id)}.png`;
          link.click();
        })
        .catch((error: any) => console.error('Error saving image:', error))
        .finally(() => this.downloading = false);
    } else {
      this.downloading = false;
    }
  }

  setDefaultTimeForEvent() {
    const localStorageEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]');
    const eventIndex = localStorageEvents.findIndex((item: any) => item.key === this.shareItem.item.key);
    
    if (eventIndex !== -1) {
      localStorageEvents[eventIndex].defaultTime = this.shareItem.time;
      localStorageEvents[eventIndex].event = localStorageEvents[eventIndex].event.map((item: any) => {
        const [hours] = this.shareItem.time.split('|')[1].split(':').map(Number);
        const newSolar = new Date(item.solar);
        newSolar.setHours(hours, 0, 0);
        return {
          ...item,
          solar: newSolar,
          lunar: { ...item.lunar, lunarTime: this.shareItem.time }
        };
      });

      localStorage.setItem('tuanCuu', JSON.stringify(localStorageEvents));
      this.isShowButtonSetDefault = false;
      this.getLocalStorageTuanCuu();
    }
  }

  onSyncToGoogleCalendar(element: any, item: any) {
    const foundTitle = this.caoDaiTitle.find((cdt: any) => cdt.key === item?.details?.title);
    const name = item?.details.holyName ? `${item?.details?.holyName} - ${item?.details?.name}` : item?.details?.name;
    const data = {
      text: `${foundTitle?.eventTitle} ${element?.eventName} cho ${foundTitle?.name} ${name}`,
      dates: [new Date(element.solar), new Date(new Date(element.solar).getTime() + 60 * 60 * 1000)],
      subTitle: ''
    };
    const url = this.calendarService.getGoogleCalendarEventEditUrl(data);
    window.open(url, '_blank');
  }

  changeTime() {
    const localStorageEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]');
    const eventIndex = localStorageEvents.findIndex((item: any) => item.key === this.shareItem.item.key);
    
    if (eventIndex !== -1) {
      localStorageEvents[eventIndex].event = localStorageEvents[eventIndex].event.map((ev: any) => {
        if (ev?.key === this.shareItem?.id) {
          const [hours, minutes] = this.shareItem.time.split('|')[1].split(':').map(Number);
          const newSolar = new Date(ev.solar);
          newSolar.setHours(hours, minutes, 0);
          return {
            ...ev,
            key: this.commonService.generatedSlug(`${ev?.eventName} ${this.datePipe.transform(newSolar, 'YYYYMMdd')}` || 'caodaion-qr'),
            solar: newSolar.toJSON(),
            lunar: { ...ev.lunar, lunarTime: this.shareItem.time }
          };
        }
        return ev;
      });

      localStorage.setItem('tuanCuu', JSON.stringify(localStorageEvents));
      this.getLocalStorageTuanCuu();
    }
  }

  onPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      (event.target as HTMLInputElement).value += ' ';
    }
  }
}
