import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';


type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly sheetId = `2PACX-1vTsJmf7PU_OGzxa4ruikf-OC7aDF2NGlLbIi9jKTthpc7OAPA2fe07nU5SWQ3Yx7HCbyAFxeRXMBQKp`
  readonly quizWorkbook: any;
  readonly settingStudentData: any;
  readonly quizOfWorkbook: any;
  readonly quizList: any;
  readonly quizSetting: any;
  isActiveQuizList: boolean = false;
  countSettingValueColIndex = 2
  constructor() {
    this.fetchWorkbook()
  }

  fetchWorkbook() {
    if (!this.quizWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.sheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.quizWorkbook = workbook
          this.isActiveQuizList = true
          this.getQuizList()
            .subscribe()
        }))
    }
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

  getQuizList(request?: any): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'quiz'
      if (request?.subject && request?.time) {
        querySheet = request.subject
      }
      const quizList = this.quizWorkbook.Sheets[querySheet]
      let data = this.decodeRawSheetData(quizList).filter((item: any) => !!item.key)
      if (!request?.subject && !request?.time) {
        const ref: Mutable<this> = this;
        ref.settingStudentData = data
      }
      const ref: Mutable<this> = this;
      ref.quizList = data
      const response = {
        code: data?.length > 0 ? 200 : 404,
        data: data
      }
      observable.next(response)
      observable.complete()
    })
  }

  getQuizListOfDoc(docId: any, article: any) {
    return new Observable((observable) => {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', docId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.quizOfWorkbook = workbook
          ref.quizSetting = this.decodeRawSheetData(this.quizOfWorkbook.Sheets[article || 'setting'])
          if (!article) {
            ref.quizSetting = ref.quizSetting.filter((item: any) => !!item.key)
          }
          const response = <any>{
            code: ref.quizSetting?.length > 0 ? 200 : 404,
            data: ref.quizSetting
          }
          if (article) {
            response['name'] =this.decodeRawSheetData(this.quizOfWorkbook.Sheets['setting'])?.find((item: any) => item.key === article)?.name
          }
          observable.next(response)
          observable.complete()
        }))
    })
  }
}
