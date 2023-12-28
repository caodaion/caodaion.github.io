import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SoanSoService } from 'src/app/shared/services/soan-so/soan-so.service';
import * as CryptoJS from "crypto-js";
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { DecimalPipe } from '@angular/common';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private soanSoService: SoanSoService,
    private calendarService: CalendarService,
    private decimalPipe: DecimalPipe
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
}
