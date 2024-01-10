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
export class LongSoComponent implements OnInit, AfterViewChecked {

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
  }

  ngAfterViewChecked(): void {
    if (this.eventService.isActiveMemberThanhSoList && this.memberThanhSo?.length === 0) {
      const memberThanhSo = localStorage.getItem('memberThanhSo')
      if (memberThanhSo !== 'null') {
        this.selectedThanhSo = memberThanhSo
      }
      this.getMemberThanhSo()
    }
    if (this.selectedThanhSo) {
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
    const newDate = new Date();
    this.thanhSoTamTranEvent = this.selectedThanhSoEvents
      ?.filter((item: any) => item.eventType?.includes('Kỷ Niệm'))
      ?.map((item: any) => {
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
              "lunarTime": item?.thoi
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
              key: item['Timestamp'],
            }
            item.chi = 'Nhựt'
            item.name = 'Kỷ niệm'

            const tokenData = <any>{
              longSo: this.longSo,
              soTemplate: 'so-cau-sieu',
              eventName: `${item?.name?.replace('Sớ ', '')} ${item?.chi ? 'chi ' + item?.chi : ''}`,
              eventLunar: eventLunar ? eventLunar : this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar,
              subject: subject
            }

            this.generateToken(tokenData)
              .subscribe((tk: any) => {
                item.link = `soan-so/${tk}`
              })
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
          subject: subject,
          link: item?.link,
        }
      })
  }
}
