import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FIXED_EVENT } from '../../constants/master-data/fixed-event.constant';
import { read, utils } from 'xlsx';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: any[] = [];
  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly sheetId = `2PACX-1vSRtHl3pP1qRsmnajbePLYP4lUj8YNdmCwZLqVoT9o2Q9KZ6eWbEU9J-xUYOiKDWsIkyJiCpcdj-8Tw`
  readonly thanhSoSheetId = ``
  readonly memberThanhSoWorkbook: any;
  readonly selectedThanhSoWorkbook: any;
  readonly memberThanhSoOfWorkbook: any;
  readonly memberThanhSoList: any;
  readonly selectedThanhSoList: any;
  readonly memberThanhSoSetting: any;
  isActiveMemberThanhSoList: boolean = false;
  isActiveSelectedThanhSo: boolean = false;
  countSettingValueColIndex = 2
    this.fetchWorkbook()
    if (this.thanhSoSheetId) {
      this.fetchThanhSoWorkbook()
    }

  getEventList() {
    this.eventList = FIXED_EVENT.data
  }
    return responseData
  }

  getMemberThanhSo(request?: any): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'centerDatabase'
      if (request?.subject && request?.time) {
        querySheet = request.subject
      }
      const quizList = this.memberThanhSoWorkbook.Sheets[querySheet]
      let data = this.decodeRawSheetData(quizList).filter((item: any) => !!item.key)
      const ref: Mutable<this> = this;
      ref.memberThanhSoList = data
      const response = {
        code: data?.length > 0 ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
    })
  }

  getSelectedThanhSo(request?: any): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'Form Responses 1'
      if (request?.subject && request?.time) {
        querySheet = request.subject
      }
      const ref: Mutable<this> = this;
      if (!ref.thanhSoSheetId) {
        if (request?.key) {
          querySheet = request?.key
          ref.thanhSoSheetId = request?.key
          this.fetchThanhSoWorkbook()
        }
      } else {
        if (this.selectedThanhSoWorkbook) {
          const quizList = this.selectedThanhSoWorkbook.Sheets[querySheet]
          let data = this.decodeRawSheetData(quizList).filter((item: any) => !!item['Timestamp'])
          ref.selectedThanhSoList = data
          const response = {
            code: data?.length > 0 ? 200 : 404,
            data: data
          }
          observable.next(response)
          observable.complete()
        } else {
          this.fetchThanhSoWorkbook()
        }
      }
    })
  }
}
