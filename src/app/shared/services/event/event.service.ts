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

  constructor() {
    this.fetchWorkbook()
    if (this.thanhSoSheetId) {
      this.fetchThanhSoWorkbook()
    }
  }

  getEventList() {
    this.eventList = FIXED_EVENT.data
  }

  fetchThanhSoWorkbook() {
    if (!this.selectedThanhSoWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.thanhSoSheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.selectedThanhSoWorkbook = workbook
          this.isActiveSelectedThanhSo = true
          this.getSelectedThanhSo({ key: this.thanhSoSheetId })
            .subscribe()
        }))
    }
  }

  fetchWorkbook() {
    if (!this.memberThanhSoWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.sheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.memberThanhSoWorkbook = workbook
          this.isActiveMemberThanhSoList = true
          this.getMemberThanhSo()
            .subscribe()
        }))
    }
  }

  private decodeRawSheetData(data: any, slice: any = 1, header?: any) {
    const column = [...new Set(Object.keys(data).map((col: any) => {
      let returnData = data[col.replace(/\d+((.|,)\d+)?/, slice)]
      if (returnData) {
        if (!parseFloat(returnData['v'])) {
          return returnData['v']
        } else {
          return new Date(returnData['v']).toString() !== 'Invalid Date' ? returnData['v'] : new Date(returnData['w']).getTime()
        }
      }
    }))]?.filter((col: any) => !!col)
    const responseData = utils.sheet_to_json<any>(data, {
      header: header || column
    })?.slice(slice);
    responseData.forEach((item: any) => {
      if (item?.option?.includes('||')) {
        item.options = item?.option?.split('||')
      }
    })
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
