import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { FIXED_EVENT } from '../../constants/master-data/fixed-event.constant';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: any[] = [];
  constructor(private http: HttpClient) {}

  getEventList() {
    this.eventList = FIXED_EVENT.data
  }
}
