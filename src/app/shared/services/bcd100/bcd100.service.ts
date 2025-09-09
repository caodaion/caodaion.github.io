import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { Observable } from 'rxjs';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class Bcd100Service {

  readonly sheetId = `2PACX-1vQRcccHaW9F-hC9mPfuDRxhCl4a-jku4iWedZOLkyvaVCYt0wD1ZhH4P0LhnTjP_J_CpWdlMLVDFlHM`
  readonly bcd100Workbook: any;
  readonly bcd100: any;
  readonly bcd100Setting = <any>{};

  constructor(
    private sheetService: SheetService
  ) { }

  fetchBcd100Data(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.bcd100Workbook.Sheets['data'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const bcd100Setting = <any>{}
            settings.forEach((item: any) => {
              bcd100Setting[item?.key] = item?.data
            })
            const data = res?.filter((item: any) => item?.Timestamp !== 'setting')
            response.status = 200
            response.data = data
            ref.bcd100Setting = bcd100Setting;
            response.setting = bcd100Setting
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.bcd100Workbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.bcd100Workbook = res?.workbook
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
}
