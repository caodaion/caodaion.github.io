import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { Observable } from 'rxjs';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class DienThoPhatMauService {


  readonly sheetId = `2PACX-1vR7KmDI0VFeL7oqXTNvj4OMS0qk9-oebKYLvZRxDujPS5FcSCGRSiODep9FGkCDu6SpAer8_ZYnMSUR`
  readonly dienThoPhatMauWorkbook: any;
  readonly dienThoPhatMau: any;
  readonly dienThoPhatMauSetting = <any>{};

  constructor(
    private sheetService: SheetService
  ) { }

  fetchDienThoPhatMauData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.dienThoPhatMauWorkbook.Sheets['database'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const dienThoPhatMauSetting = <any>{}
            settings.forEach((item: any) => {
              dienThoPhatMauSetting[item?.logFrom] = item?.data
            })
            let price = <any>[];
            let bill = <any>[];
            let data = <any>[];
            res?.forEach((item: any, resIndex: any) => {
              if (item?.Timestamp != 'setting') {
                if (!data) {
                  data = <any>[]
                }
                if (!price) {
                  price = <any>[]
                }
                const dataRow = JSON.parse(item.data)
                dataRow?.forEach((dr: any, dataRowIndex: any) => {
                  if (dr?.key) {
                    switch (dr?.key) {
                      case 'price':
                        let priceData: any = <any>{}
                        priceData = dr?.data
                        priceData.updatedBy = item?.updatedBy
                        priceData.logFrom = item?.logFrom
                        price.push(dr?.data)
                        break;
                      case 'bill':
                        let billData: any = <any>{}
                        billData = dr?.data
                        billData.updatedBy = item?.updatedBy
                        billData.logFrom = item?.logFrom
                        bill.push(dr?.data)
                        break;
                    }
                  }
                })
              }
              if (resIndex === res?.length - 1) {
                bill?.forEach((billItem: any) => {
                  billItem?.materials?.forEach((material: any) => {
                    if (typeof material?.material === 'string') {
                      const itemMaterial = price?.find((priceItem: any) => priceItem?.key === material.material)
                      material.material = itemMaterial
                    }
                  });
                  data.push(billItem);
                })
              }
            })
            response.status = 200
            response.data = data
            response.price = price
            ref.dienThoPhatMauSetting = dienThoPhatMauSetting;
            ref.dienThoPhatMau = data;
            response.setting = dienThoPhatMauSetting
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.dienThoPhatMauWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.dienThoPhatMauWorkbook = res?.workbook
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
