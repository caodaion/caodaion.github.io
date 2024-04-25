import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class TinyUrlService {

  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly sheetId = `2PACX-1vTYV0g4h3Mm8ivzpvKSdjB6MjAvqQeP-TkAFohZjmuNtLuLJI5dc6c1aj8HDBTVWR0acUXnToQJnQTO`
  readonly shortWorkbook: any;
  readonly shortList = <any>[];
  shortSetting = <any>{};
  isActiveShortWorkBook: boolean = false

  constructor(private http: HttpClient) { }

  fetchShort(): Observable<any> {
    return new Observable((observable) => {
      const returnData = () => {
        const ref: Mutable<this> = this;
        let settingQuerySheet = 'setting'
        let shrotsQuerySheet = 'Form Responses 1'
        const settingList = this.shortWorkbook.Sheets[settingQuerySheet]
        const shortList = this.shortWorkbook.Sheets[shrotsQuerySheet]
        let settingRawData = this.decodeRawSheetData(settingList)
        let shortRawData = this.decodeRawSheetData(shortList)
        let settingData = <any>{}
        settingRawData?.forEach((item: any) => {
          settingData[item?.field] = item?.trigger
        })
        ref.shortSetting = settingData
        ref.shortList = shortRawData
        const response = {
          code: settingRawData?.length > 0 ? 200 : 404,
          data: {
            setting: settingData,
            data: shortRawData
          }
        }
        observable.next(response)
        observable.complete()
      }
      if (!this.shortWorkbook) {
        const ref: Mutable<this> = this;
        const sheetUrl = this.sheetUrl.replace('{id}', this.sheetId)
        const fetchPromise = new Promise((resolve, rejects) => {
          fetch(sheetUrl)
            .then((res: any) => res.arrayBuffer())
            .then((req => {
              const workbook = read(req)
              resolve(workbook)
            }))
        })
        fetchPromise.then((value: any) => {
          ref.shortWorkbook = value
          if (this.shortWorkbook) {
            this.isActiveShortWorkBook = true
            returnData()
          }
        })
      } else {
        returnData()
      }
    })

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

  shortenUrl(url: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer L9617Wffv17qx50IA1wfBbLEvarAyj1IH8QA6ybwVs9fOctXb0D5QXiiiqBi`
    })
    return this.http.post(`https://api.tinyurl.com/create`, {
      "url": url,
    }, { headers: headers })
  }
}
