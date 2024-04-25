import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`

  constructor() { }

  decodeRawSheetData(data: any, slice: any = 1, header?: any): Observable<any> {
    return new Observable((observable) => {
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
      observable.next(responseData)
      observable.complete()
    })
  }

  fetchSheet(sheetId: any, querySheet?: any, decode?: any): Observable<any> {
    return new Observable((observable) => {
      let workbook: any;
      const returnData = (workbook: any) => {
        const rawDataSheet = workbook.Sheets[querySheet]
        let rawData = <any>[]
        this.decodeRawSheetData(rawDataSheet, decode.decodeSlice, decode.header)
          .subscribe((res: any) => {
            rawData = res
          })
        const response = {
          status: rawData?.length > 0 ? 200 : 404,
          data: rawData,
          workbook
        }
        observable.next(response)
        observable.complete()
      }
      if (!workbook) {
        const sheetUrl = this.sheetUrl.replace('{id}', sheetId)
        const fetchPromise = new Promise((resolve, rejects) => {
          fetch(sheetUrl)
            .then((res: any) => res.arrayBuffer())
            .then((req => {
              const workbook = read(req)
              resolve(workbook)
              rejects()
            }))
        })
        fetchPromise.then((value: any) => {
          workbook = value
          if (workbook) {
            if (querySheet) {
              returnData(workbook)
            } else {
              const response = {
                status: 200,
                workbook: workbook
              }
              observable.next(response)
              observable.complete()
            }
          }
        })
          .catch((error) => console.error(error));
      } else {
        if (querySheet) {
          returnData(workbook)
        } else {
          const response = {
            status: 200,
            workbook: workbook
          }
          observable.next(response)
          observable.complete()
        }
      }
    })
  }
}
