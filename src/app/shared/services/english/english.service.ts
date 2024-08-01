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
        this.sheetService.decodeRawSheetData(ref.englishWorkbook.Sheets['english'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const englishSetting = <any>{}
            settings.forEach((item: any) => {
              englishSetting[item?.key] = item?.data
            })
            let data = <any>[];
            res?.forEach((item: any) => {
              if (item?.Timestamp != 'setting' && item?.data && !item.key?.match(`edit[0-9]`)) {
                const responseItem: any = item
                let editKey = ''
                item.key?.split('-')?.forEach((v: any) => {
                  if (v?.length > 1) {
                    editKey += `${v[0]}${v[v?.length - 1]}`
                  } else {
                    editKey += v
                  }
                  editKey += '-'
                })
                const editToken = res?.find((r: any) => r.key?.match(`${editKey}edit[0-9]`))
                if (editToken?.data && editToken?.data?.match(`edit[0-9]`)?.length > 0) {
                  responseItem.editToken = `?${editToken?.data?.match(`edit[0-9]`)[0]}=${editToken?.data}`
                }
                if (!data) {
                  data = <any>[]
                }
                data.push(responseItem)
              }
            })
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
