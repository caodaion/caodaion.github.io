import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';
import { SheetService } from '../sheet/sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class TinyUrlService {

  readonly sheetId = `2PACX-1vTYV0g4h3Mm8ivzpvKSdjB6MjAvqQeP-TkAFohZjmuNtLuLJI5dc6c1aj8HDBTVWR0acUXnToQJnQTO`
  readonly shortWorkbook: any;
  readonly shortListSheet = 'Form Responses 1';
  readonly shortSettingSheet = 'setting';
  readonly shortList = <any>[];
  shortSetting = <any>{};
  isActiveShortWorkBook: boolean = false

  constructor(private http: HttpClient, private sheetService: SheetService) { }

  fetchShort(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}        
        this.sheetService.decodeRawSheetData(ref.shortWorkbook.Sheets[this.shortSettingSheet])
          .subscribe((res: any) => {
            const setting = res;
            setting?.forEach((item: any) => {
              this.shortSetting[item?.field] = item?.trigger
            })
            if (setting?.length > 0) {
              response.status = 200;
              response.setting = this.shortSetting
            } else {
              response.status = 400;
            }
            this.sheetService.decodeRawSheetData(ref.shortWorkbook.Sheets[this.shortListSheet], 1, {raw: true})
              .subscribe((res: any) => {                
                ref.shortList = res;
                response.shorts = ref.shortList
                observable.next(response)
                observable.complete()
              })
          })
      }
      if (!ref.shortWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.shortWorkbook = res?.workbook                  
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
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
