import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SoanSoService } from 'src/app/shared/services/soan-so/soan-so.service';
import * as CryptoJS from "crypto-js";
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
  selector: 'app-long-so',
  templateUrl: './long-so.component.html',
  styleUrls: ['./long-so.component.scss']
})
export class LongSoComponent implements OnInit {

  @Input() longSo: any;

  cols: any;
  longSoList: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private soanSoService: SoanSoService,
    private calendarService: CalendarService
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
            const data = <any>{
              key: item,
              name: res[item]?.name,
              chi: res[item]?.chi,
              eventLunar: res[item]?.eventLunar
            }
            return data
          })
          const newDate = new Date()
          this.longSoList.forEach((item: any) => {
            const tokenData = <any>{
              longSo: this.longSo,
              soTemplate: item?.name?.replace('Sớ ', ''),
              eventName: `${item?.name?.replace('Sớ ', '')} ${item?.chi ? 'chi ' + item?.chi : ''}`,
              eventLunar: item?.eventLunar ? item?.eventLunar : this.calendarService.getConvertedFullDate(newDate).convertSolar2Lunar,
            }
            this.generateToken(tokenData)
              .subscribe((tk: any) => {
                item.link = `soan-so/${tk}`
              })
          })
        }
      })
  }
}
