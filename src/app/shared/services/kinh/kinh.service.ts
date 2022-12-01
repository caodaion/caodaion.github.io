import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
@Injectable({
  providedIn: 'root',
})
export class KinhService {
  kinhList: any[] = [];
  constructor(private http: HttpClient) {}

  getKinhList(): Observable<any> {
    return this.http
      .get(`assets/documents/kinh/tam-ky-pho-do-kinh.json`);
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
    return this.http.get(`assets/documents/kinh/${key}.json`);
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
}
