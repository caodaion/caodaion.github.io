import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { SheetService } from '../sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root',
})
export class KinhService {
  kinhList: any[] = [];
  readonly sheetId = `2PACX-1vRUYTOzo5GmDEH9tKKvLT01LPcHjUYxlPgZ2tojIznJrXe9Dshf1D3VC3eUYAgr_XbS53ROc0BrPq7L`;
  readonly kinhInformationSheet = 'Form Responses 1';
  readonly kinhInformationWorkbook: any;
  readonly kinhInformationData: any;
  isActiveKinhInformationData: boolean = false;

  constructor(
    private http: HttpClient,
    private sheetService: SheetService
  ) { }

  getKinhList(): Observable<any> {
    return this.http
      .get(`assets/documents/kinh/kinh_list.json`);
    // const url = `${API_PATH.kinh.root}`;
    // return this.http.get(url);
  }

  getKinhFilter(): Observable<any> {
    return this.http.get(`assets/documents/kinh/kinh-filter.json`);
    // const url = `${API_PATH.kinh.root}`;
    // return this.http.get(url);
  }

  getNewKinhTemplate(): Observable<any> {
    return this.http.get(`assets/documents/kinh/new-kinh-template.json`);
  }

  getKinhContent(key: any): Observable<any> {
    return this.http.get(`assets/documents/kinh/${key}.txt`, { responseType: 'text' });
  }

  getKinhContentFromAPI(key: any): Observable<any> {
    const url = `${API_PATH.kinh.root}/${key}`;
    return this.http.get(url);
  }

  addKinh(req: any) {
    const url = `${API_PATH.kinh.root}`;
    return this.http.post(url, req);
  }

  updateKinh(req: any) {
    const url = `${API_PATH.kinh.root}`;
    return this.http.put(url, req);
  }

  fetchKinhInformation(key: string): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.kinhInformationWorkbook.Sheets[this.kinhInformationSheet])
          .subscribe((res: any) => {
            const informationData = res?.filter((item: any) => item?.key?.includes(key));
            response.data = informationData
            response.status = 200
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.kinhInformationWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.kinhInformationWorkbook = res?.workbook
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
