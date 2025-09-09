import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PARAMS } from '../../constants/api.constant';
import { environment } from 'src/environments/environment';
import { read, utils } from 'xlsx';
import { SheetService } from '../sheet/sheet.service';
import { CommonService } from '../common/common.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  readonly sheetId = `2PACX-1vTsCA5rwuatpvDRWVRURaUJX74WoYG22AWBFsDN1J55IEZYTlYC4xsNdgHR6NDvdTzbMmWIRNKdxE23`
  readonly libraryWorkbook: any;
  readonly library: any;
  readonly librarySetting = <any>{};
  readonly libraryList = <any>[];
  readonly labels = <any>[];

  constructor(private http: HttpClient, private sheetService: SheetService, private commonService: CommonService) {
    this.fetchLibrary()
  }

  fetchLibrary(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      let response = <any>{}
      this.sheetService.fetchSheet(this.sheetId)
        .subscribe((res: any) => {
          if (res.status === 200) {
            if (res?.workbook) {
              ref.libraryWorkbook = res.workbook
              response.status = 200
              this.sheetService.decodeRawSheetData(ref.libraryWorkbook?.Sheets['settings'])
                ?.subscribe((res: any) => {
                  res?.forEach((item: any) => {
                    ref.librarySetting[item?.field] = item?.trigger
                  })
                  response.setting = ref.librarySetting
                  this.sheetService.decodeRawSheetData(ref.libraryWorkbook?.Sheets['library'])
                    ?.subscribe((res: any) => {
                      ref.libraryList = <any>[];
                      res?.forEach((item: any) => {
                        let responseBook = <any>{}
                        responseBook = item
                        responseBook.labels = JSON.parse(item?.labels || '[]')
                        if (responseBook?.name) {
                          let editKey = ''
                          responseBook.key?.split('-')?.forEach((v: any) => {
                            if (v?.length > 1) {
                              editKey += `${v[0]}${v[v?.length - 1]}`
                            } else {
                              editKey += v
                            }
                            editKey += '-'
                          })
                          const editToken = res?.find((r: any) => r.key?.match(`${editKey}edit[0-9]`))
                          if (editToken?.googleDocId) {
                            responseBook.editToken = `?${editToken?.key?.match(`edit[0-9]`)[0]}=${editToken?.googleDocId}`
                          }
                          ref.libraryList?.push(responseBook)
                        }
                        const itemLabels = item?.labels
                        ref.labels = [...new Set(ref.labels.concat(itemLabels))]
                      })
                      response.data = ref.libraryList
                      response.labels = ref.labels
                      response.setting = ref.librarySetting
                      observable.next(response)
                      observable.complete()
                    })
                  observable.next(response)
                  observable.complete()
                })
            }
          }
        })
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
