import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { Observable } from 'rxjs';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class EnglishService {

  readonly sheetId = `2PACX-1vQmi71AQ6DX6KQ64DiB68UVc8qdjUsmRfr3X-2PLJEOjh_O2CqyZR-J2GxFkpnsOfa2-YPhJnWBdCFT`
  readonly englishWorkbook: any;
  readonly english: any;
  readonly englishSetting = <any>{};

  constructor(
    private sheetService: SheetService
  ) { }

  fetchEnglishData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.englishWorkbook.Sheets['Form Responses 1'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const englishSetting = <any>{}
            settings.forEach((item: any) => {
              englishSetting[item?.key] = item?.data
            })
            const data = res?.filter((item: any) => item?.Timestamp !== 'setting')
            response.status = 200
            response.data = data
            ref.englishSetting = englishSetting;
            ref.english = data;
            response.setting = englishSetting
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.englishWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.englishWorkbook = res?.workbook
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
