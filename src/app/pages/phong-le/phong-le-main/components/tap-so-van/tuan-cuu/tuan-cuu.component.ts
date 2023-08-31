import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import * as CryptoJS from "crypto-js";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tuan-cuu',
  templateUrl: './tuan-cuu.component.html',
  styleUrls: ['./tuan-cuu.component.scss']
})
export class TuanCuuComponent implements OnInit {

  tuanCuuEvents = <any>[]
  cols: any;
  expanedIndex: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private commonService: CommonService,
    private datePipe: DatePipe
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
    this.tuanCuuEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    this.expanedIndex = 0
    let lessDiff = 0
    const currentDate = new Date()
    this.tuanCuuEvents?.forEach((item: any, index: any) => {
      const foundTitle = CAODAI_TITLE.data.find((ct: any) => ct.key === item?.details?.title)
      if (foundTitle) {
        item.eventName = `Soạn sớ ${foundTitle?.eventTitle?.toLocaleLowerCase()} tuần cửu cho ${foundTitle?.howToAddress ? (item.details.sex === 'male' ? foundTitle?.howToAddress.male : item.details.sex === 'female' ? foundTitle?.howToAddress.female : '') : ''} ${foundTitle?.name} ${item.details?.holyName || item.details?.name} ${item.details?.age ? item.details?.age + ' tuổi.' : '.'}`
      }
      item?.event?.forEach((ev: any) => {
        ev.lunar.lunarTime = item.defaultTime || ev.lunar.lunarTime
        const tokenData = <any>{
          soTemplate: foundTitle?.eventTitle,
          eventName: ev.eventName,
          eventLunar: ev.lunar,
          subject: {
            date: item?.date,
            details: item?.details,
            key: item?.key
          }
        }
        this.generateToken(tokenData)
          .subscribe((tk: any) => {
            ev.link = `soan-so/${tk}`
          })
        ev.upComming = false
        if (this.datePipe.transform(new Date(ev?.solar), 'dd/MM/yyyy') == this.datePipe.transform(currentDate, 'dd/MM/yyyy')) {
          this.expanedIndex = index
          ev.upComming = true
          return;
        }
        if (new Date(ev?.solar) > currentDate) {
          const difference = moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(ev?.solar), "DD/MM/YYYY HH:mm:ss"))
          if (lessDiff !== 0) {
            if (lessDiff < difference) {
              lessDiff = difference
              this.expanedIndex = index
              ev.upComming = true
            }
          } else {
            lessDiff = difference
            ev.upComming = true
          }
        }
      })
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
}
