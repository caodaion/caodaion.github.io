import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { THANH_NGON_HIEP_TUYEN } from '../../constants/master-data/thanh-ngon-hiep-tuyen.contstant';

@Injectable({
  providedIn: 'root',
})
export class TnhtService {
  tableContent: any;
  constructor(private http: HttpClient) {}

  getTNHTByPath(path: any): Observable<any> {
    return new Observable((observer) => {
      observer.next(THANH_NGON_HIEP_TUYEN)
    });
  }
}
