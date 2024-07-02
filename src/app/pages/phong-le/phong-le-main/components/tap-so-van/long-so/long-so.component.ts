import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SoanSoService } from 'src/app/shared/services/soan-so/soan-so.service';
import * as CryptoJS from "crypto-js";
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { DecimalPipe } from '@angular/common';
import { EventService } from 'src/app/shared/services/event/event.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';

@Component({
  selector: 'app-long-so',
  templateUrl: './long-so.component.html',
  styleUrls: ['./long-so.component.scss']
})
export class LongSoComponent implements OnInit {

  @Input() longSo: any;

  cols: any;
  longSoList: any;
  upCommingLongSoList: any;
  memberThanhSo = <any>[]
  selectedThanhSoEvents = <any>[]
  thanhSoTamTranEvent = <any>[]
  selectedThanhSo: any;
  currentUser: any;
  allowToUpdateMember: any;
  refresh = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private soanSoService: SoanSoService,
    private calendarService: CalendarService,
    private decimalPipe: DecimalPipe,
    private eventService: EventService,
    private authService: AuthService,
    private commonService: CommonService,
    private decimal: DecimalPipe
  ) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1;
        } else {
          this.cols = 6;
        }
      });
    this.getLongSoList()
    if (this.memberThanhSo?.length === 0) {
      const memberThanhSo = localStorage.getItem('memberThanhSo')
      if (memberThanhSo !== 'null') {
        this.selectedThanhSo = memberThanhSo
      }
      this.getMemberThanhSo()
    }
  }

  getMemberThanhSo() {
    this.eventService.fetchRegisteredMember()
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.memberThanhSo = [{ key: 'null', thanhSo: 'Chọn Thánh Sở của bạn' }].concat(res.data)
          this.authService.getCurrentUser().subscribe((res: any) => {
            this.currentUser = res;
            this.allowToUpdateMember = this.memberThanhSo.find((item: any) => item.updatePremissionFor === this.currentUser?.userName)
            if (this.selectedThanhSo) {
              this.getThanhSoEvent()
            }
          })
        }
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

  getLongSoList() {
    this.soanSoService.getLongSoList(this.longSo)
      .subscribe((res: any) => {
        if (res) {
          this.longSoList = Object.keys(res).map((item: any) => {
            if (res[item].eventLunar) {
              res[item].eventLunar.lunarYear = new Date().getFullYear()
            }
            if (!res[item]?.eventLunar && res[item]?.eventSolar) {
              res[item].eventLunar = <any>{}
              res[item].eventLunar = this.calendarService.getConvertedFullDate(res[item]?.eventSolar).convertSolar2Lunar
              res[item].eventLunar.lunarTime = res[item].lunarTime
            }
            const data = <any>{
              key: item,
              name: res[item]?.name,
              chi: res[item]?.chi,
              eventSolar: res[item]?.eventSolar,
              lunarTime: res[item]?.lunarTime,
              eventLunar: res[item]?.eventLunar
            }
            return data
          })
          const newDate = new Date()
          this.longSoList.forEach((item: any) => {
            const tokenData = <any>{
              longSo: this.longSo,
              soTemplate: item.key,
              eventName: `${item?.name?.replace('Sớ ', '')} ${item?.chi ? 'chi ' + item?.chi : ''}`,
              eventLunar: item?.eventLunar ? item?.eventLunar : this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar,
            }
            this.generateToken(tokenData)
              .subscribe((tk: any) => {
                item.link = `soan-so/${tk}`
              })
          })
          this.upCommingLongSoList = <any>[]
          const nowLunar = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
          const socVongSo = this.longSoList.filter((item: any) => item.key.includes('so-soc-vong'))
          this.upCommingLongSoList = this.upCommingLongSoList.concat(socVongSo)
          this.upCommingLongSoList.forEach((item: any) => {
            const localNowLunar = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
            const nextMonth = localNowLunar.lunarMonth + 1
            item.eventLunar = {
              lunarDay: nowLunar.lunarDay > 15 ? 1 : 15,
              lunarMonth: nowLunar.lunarDay > 15 ? nextMonth : localNowLunar.lunarMonth,
              lunarTime: item.lunarTime,
              lunarYear: nextMonth > 12 ? ((new Date().getFullYear()) + 1) : new Date().getFullYear()
            }
            const tokenData = <any>{
              longSo: this.longSo,
              soTemplate: item.key,
              eventName: `${item?.name?.replace('Sớ ', '')} ${item?.chi ? 'chi ' + item?.chi : ''}`,
              eventLunar: item?.eventLunar ? item?.eventLunar : this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar,
            }
            this.generateToken(tokenData)
              .subscribe((tk: any) => {
                item.link = `soan-so/${tk}`
              })
          })
          this.longSoList.forEach((item: any) => {
            if (item?.eventLunar) {
              const convertDate = this.calendarService.getConvertedFullDate(item?.eventLunar).convertLunar2Solar
              const eventSolarDate = new Date(`${convertDate[2]}-${this.decimalPipe.transform(convertDate[1], '2.0-0')}-${this.decimalPipe.transform(convertDate[0], '2.0-0')}`)
              if (newDate < eventSolarDate) {
                if (newDate > new Date(eventSolarDate.setDate(eventSolarDate.getDate() - 14))) {
                  item.upComming = true
                }
              }
            }
          })
          this.upCommingLongSoList = [...new Set(this.upCommingLongSoList.concat(this.longSoList.filter((item: any) => item.upComming)))]
          this.upCommingLongSoList = this.upCommingLongSoList.sort((a: any, b: any) => a.eventLunar.lunarMonth < b.eventLunar.lunarMonth || a.eventLunar.lunarDay < b.eventLunar.lunarDay ? -1 : 1)
        }
      })
  }

  getThanhSoEvent() {
    if (this.selectedThanhSo) {
      this.eventService.fetchThanhSoEvent(this.selectedThanhSo)
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.selectedThanhSoEvents = res.data
            this.refresh = true
            this.mergeThanhSoEvent()
          }
        })
    }
  }

  mergeThanhSoEvent() {
    const newDate = new Date();
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
    this.thanhSoTamTranEvent = data
      ?.sort((a: any, b: any) => a.eventLunar.lunarMonth < b.eventLunar.lunarMonth || a.eventLunar.lunarDay < b.eventLunar.lunarDay ? -1 : 1)
      ?.filter((item: any) => item.eventLunar.lunarMonth < 12 ? (item.eventLunar.lunarMonth >= this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar?.lunarMonth) : (item.eventLunar.lunarMonth === 12 || item.eventLunar.lunarMonth === 1))
    this.thanhSoTamTranEvent?.forEach((item: any) => {
      const tokenData = <any>{
        longSo: this.longSo,
        soTemplate: 'so-cau-sieu',
        eventName: item?.eventName,
        eventAddress: item?.eventAddress,
        eventLunar: item?.eventLunar ? item?.eventLunar : this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar,
        subject: item?.subject
      }
      this.generateToken(tokenData)
        .subscribe((tk: any) => {
          item.link = `soan-so/${tk}`
        })
    })
  }
}
