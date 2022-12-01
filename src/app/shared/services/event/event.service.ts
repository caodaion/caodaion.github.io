import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: any[] = [];
  constructor(private http: HttpClient) {}

  getEventList(): Observable<any> {
    return this.http.get(`assets/documents/event/event.json`);
    // const url = `${API_PATH.kinh.root}`;
    // return this.http.get(url);
  }
}
