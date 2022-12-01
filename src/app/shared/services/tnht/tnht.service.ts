import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
@Injectable({
  providedIn: 'root',
})
export class TnhtService {
  constructor(private http: HttpClient) {}

  getTNHTByPath(path: any): Observable<any> {
    return this.http.get(`assets/documents/thanh-ngon-hiep-tuyen/${path}.json`);
  }
}
