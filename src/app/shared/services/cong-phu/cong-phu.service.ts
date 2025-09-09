import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { Observable } from 'rxjs';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class CongPhuService {

  readonly sheetId = `2PACX-1vQ77WISZodpYGP5ROQYQzod2bnqw5Ch1GCN2cCH7B1oNuwh1gpUIdSUT2mcoc0GYEbaR0zN_Tp7eeII`
  readonly congPhuWorkbook: any;
  readonly congPhu: any;
  readonly congPhuSetting = <any>{};

  constructor(
    private sheetService: SheetService
  ) { }

  fetchCongPhuData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.congPhuWorkbook.Sheets['Form Responses'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const congPhuSetting = <any>{}
            settings.forEach((item: any) => {
              congPhuSetting[item?.name] = item?.data
            })
            let data = <any>[];
            data = res?.filter((item: any) => item?.Timestamp !== 'setting')
            data.forEach((item: any) => {
              item.data = JSON.parse(item?.data)
              item.name = JSON.parse(item?.name)
            })
            data = data.sort((a: any, b: any) => {
              return new Date(`${a?.data?.yy}-${a?.data?.mm}-${a?.data?.dd} ${a?.data?.ti}`).getTime() - new Date(`${b?.data?.yy}-${b?.data?.mm}-${b?.data?.dd} ${b?.data?.ti}`).getTime()
            })
            const filterSetting = <any>[]
            data.forEach((item: any) => {
              if (!filterSetting.find((settingItem: any) => {
                return settingItem?.na === item?.name?.na &&
                  settingItem?.by === item?.name?.by &&
                  settingItem?.tt === item?.name?.tt
              })) {
                filterSetting.push(item?.name)
              }
            })
            response.status = 200;
            response.data = data;
            response.filterSetting = filterSetting;
            ref.congPhuSetting = congPhuSetting;
            ref.congPhu = data;
            response.setting = congPhuSetting;
            response.filterSetting = filterSetting;
            observable.next(response);
            observable.complete();
          })
      }
      if (!ref.congPhuWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status === 200) {
                if (res?.workbook) {
                  ref.congPhuWorkbook = res?.workbook;
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
