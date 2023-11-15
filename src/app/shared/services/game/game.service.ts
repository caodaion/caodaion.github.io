import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root'
})
export class GameService {
  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly purifySheetId = `2PACX-1vTKgO-Mpj1tp5jJbSl3NyiDtSekkZeobqdLPib1UA9HR3xNJ7ey3o60ob7YRd795X1vAaejq3ulNfs7`
  readonly kidsSheetId = `2PACX-1vSGRinsAchM3HiIiMCCSNEDI30Jm46STPwZnc72tg-aJ3Wm9Yse08kYjc-PgfcxBmDAOBdOh7i2O_vZ`
  readonly purifyWorkbook: any;
  readonly kidsWorkbook: any;
  readonly purifyList = <any>[];
  readonly kidsList = <any>[];
  readonly element = <any>{
    "iron": {
      name: 'kim loại'
    },
    "water": {
      name: 'nước'
    },
    "electricity": {
      name: 'sét'
    },
    "fire": {
      name: 'lửa'
    },
    "power": {
      name: 'sức mạnh'
    },
    "plant": {
      name: 'thực vật'
    },
    "bug": {
      name: 'côn trùng'
    },
    "snow": {
      name: 'tuyết'
    },
    "food": {
      name: 'thực phẩm'
    }
  };
  isActivePurifyList: boolean = false;
  isActiveKidsList: boolean = false;
  countSettingValueColIndex = 2

  constructor() {
    this.fetchWorkbook()
  }

  fetchWorkbook() {
    if (!this.purifyWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.purifySheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.purifyWorkbook = workbook
          this.isActivePurifyList = true
          this.getPurifyList()
            .subscribe()
        }))
    }
    if (!this.kidsWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.kidsSheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.kidsWorkbook = workbook
          this.isActiveKidsList = true
          this.getKidsList()
            .subscribe()
        }))
    }
  }

  getKidsList(): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'kids'
      const quizList = this.kidsWorkbook.Sheets[querySheet]
      let data = this.decodeRawSheetData(quizList).filter((item: any) => !!item.key)
      const ref: Mutable<this> = this;
      ref.kidsList = data
      const response = {
        code: data?.length > 0 ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
    })
  }

  getKidByUserName(userName: any): Observable<any> {
    return new Observable((observable) => {
      let data = this.kidsList.find((item: any) => item.userName === userName)
      const response = {
        code: data ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
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

  getPurifyList(): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'purify'
      const quizList = this.purifyWorkbook.Sheets[querySheet]
      let data = this.decodeRawSheetData(quizList).filter((item: any) => !!item.key)
      const ref: Mutable<this> = this;
      ref.purifyList = data
      const response = {
        code: data?.length > 0 ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
    })
  }

  getPurifyByKey(key: any): Observable<any> {
    return new Observable((observable) => {
      let data = this.purifyList.find((item: any) => item.key === key)
      const response = {
        code: data ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
    })
  }
}
