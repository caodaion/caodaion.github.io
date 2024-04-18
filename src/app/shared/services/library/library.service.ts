import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PARAMS } from '../../constants/api.constant';
import { environment } from 'src/environments/environment';
import { read, utils } from 'xlsx';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly sheetId = `2PACX-1vTsCA5rwuatpvDRWVRURaUJX74WoYG22AWBFsDN1J55IEZYTlYC4xsNdgHR6NDvdTzbMmWIRNKdxE23`
  readonly libraryWorkbook: any;
  readonly library: any;
  isActiveLibraryWorkBook: boolean = false

  constructor(private http: HttpClient) {
    this.fetchLibrary()
  }

  fetchLibrary() {
    if (!this.libraryWorkbook) {
      const ref: Mutable<this> = this;
      const sheetUrl = this.sheetUrl.replace('{id}', this.sheetId)
      fetch(sheetUrl)
        .then((res: any) => res.arrayBuffer())
        .then((req => {
          const workbook = read(req)
          ref.libraryWorkbook = workbook
          this.isActiveLibraryWorkBook = true
          this.getBookFromLibrary().subscribe()
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

  getBookFromLibrary(request?: any): Observable<any> {
    return new Observable((observable) => {
      let querySheet = 'library'
      if (request?.subject && request?.time) {
        querySheet = request.subject
      }
      const ref: Mutable<this> = this;
      if (this.libraryWorkbook) {
        const quizList = this.libraryWorkbook.Sheets[querySheet]
        let data = this.decodeRawSheetData(quizList)
        ref.library = data       
        const response = {
          code: data?.length > 0 ? 200 : 404,
          data: data
        }
        observable.next(response)
        observable.complete()
      }
    })
  }

  getStaticBooks(): Observable<any> {
    return this.http.get(`assets/documents/library/static-library.json`);
  }

  getTableContentByKey(key: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${key}/${'table-content'}.json`)
    }
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${key}/${'table-content'}.json${!environment.production ? '?ref=dev' : ''}`)
        .subscribe((res: any) => {
          observable.next(JSON.parse(decodeURIComponent(escape(atob(res.content)))))
          observable.complete()
        });
    })
  }

  getBookByKey(key: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${key}/${key}.txt`, { responseType: 'text' })
    }
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${key}/${key}.md${!environment.production ? '?ref=draft/' + key + '' : ''}`)
        .subscribe((res: any) => {
          const resposne = <any>{}
          resposne.data = decodeURIComponent(escape(atob(res.content)))
          observable.next(resposne)
          observable.complete()
        });
    })
  }

  getDataOfTableContent(path: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${path}.txt`, { responseType: 'text' })
    }
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${path}.md${!environment.production ? '?ref=dev' : ''}`)
        .subscribe((res: any) => {
          observable.next(decodeURIComponent(escape(atob(res.content))))
          observable.complete()
        });
    })
  }
}
