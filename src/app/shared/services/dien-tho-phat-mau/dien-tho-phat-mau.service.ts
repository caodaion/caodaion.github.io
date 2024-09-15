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
            let deletedBill = <any>[];
            let deletedPrice = <any>[];
            let updatedPrice = <any>[];
            let updatedBill = <any>[];
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
                        price.push(priceData)
                        break;
                      case 'bill':
                        let billData: any = <any>{}
                        billData = dr?.data
                        billData.updatedBy = item?.updatedBy
                        billData.logFrom = item?.logFrom
                        bill.push(billData)
                        break;
                      case 'delete-bill':
                        let deletedBillData: any = <any>{}
                        deletedBillData = dr?.data
                        deletedBillData.updatedBy = item?.updatedBy
                        deletedBillData.logFrom = item?.logFrom
                        deletedBill.push(deletedBillData)
                        break;
                      case 'delete-price':
                        let deletedPriceData: any = <any>{}
                        deletedPriceData = dr?.data
                        deletedPriceData.updatedBy = item?.updatedBy
                        deletedPriceData.logFrom = item?.logFrom
                        deletedPrice.push(deletedPriceData)
                        break;
                      case 'update-price':
                        let updatedPriceData: any = <any>{}
                        updatedPriceData = dr?.data
                        updatedPriceData.updatedBy = item?.updatedBy
                        updatedPriceData.logFrom = item?.logFrom
                        updatedPrice.push(updatedPriceData)
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
                setTimeout(() => {
                  updatedBill?.forEach((priceItem: any) => {
                    const foundUpdatedPrice = price?.find((up: any) => up?.key === priceItem?.key)
                    if (price.indexOf(foundUpdatedPrice) !== -1) {
                      price[price.indexOf(foundUpdatedPrice)] = priceItem
                    }
                  })
                  updatedPrice?.forEach((billItem: any) => {
                    const foundUpdatedBill = data?.find((ub: any) => ub?.key === billItem?.key)
                    if (data.indexOf(foundUpdatedBill) !== -1) {
                      data[data.indexOf(foundUpdatedBill)] = billItem
                    }
                  })
                }, 0);
                deletedBill?.forEach((billItem: any) => {
                  data = data?.filter((db: any) => db?.key !== billItem?.key)
                })
                deletedPrice?.forEach((priceItem: any) => {
                  price = price?.filter((pb: any) => pb?.key !== priceItem?.key)
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
