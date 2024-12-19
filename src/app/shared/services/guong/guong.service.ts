import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SheetService } from '../sheet/sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class GuongService {

  readonly sheetId = `2PACX-1vQLM7l5-mJoGPAAw6HnCZa_hXis5LsiyK1JbnKhd6Yn7RQkVbDJsJkEw3jwlH-UHwH_64JQZp5Jc221`
  readonly guongWorkbook: any;
  readonly guong: any;
  readonly guongSetting = <any>{};

  constructor(
    private sheetService: SheetService
  ) { }

  fetchGuongData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.guongWorkbook.Sheets['target'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const guongSetting = <any>{}
            settings.forEach((item: any) => {
              guongSetting[item?.name] = item?.data
            })
            let data = <any>[];
            data = res?.filter((item: any) => item?.Timestamp !== 'setting')
            data.forEach((item: any) => {
              item.data = JSON.parse(item?.data)
            })
            response.status = 200;
            response.data = data;
            ref.guongSetting = guongSetting;
            ref.guong = data;
            response.setting = guongSetting;
            observable.next(response);
            observable.complete();
          })
      }
      if (!ref.guongWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status === 200) {
                if (res?.workbook) {
                  ref.guongWorkbook = res?.workbook;
                  returnData();
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
