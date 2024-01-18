import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TacVuService {

  constructor(private http: HttpClient) { }

  getNghiTiet(key: any): Observable<any> {
    return this.http.get(`assets/documents/nghi-tiet/${key}.json`);
  }
}
