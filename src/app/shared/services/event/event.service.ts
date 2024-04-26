import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FIXED_EVENT } from '../../constants/master-data/fixed-event.constant';
import { read, utils } from 'xlsx';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: any[] = [];
  readonly sheetUrl = `https://docs.google.com/spreadsheets/d/e/{id}/pub?output=xlsx`
  readonly sheetId = `2PACX-1vSRtHl3pP1qRsmnajbePLYP4lUj8YNdmCwZLqVoT9o2Q9KZ6eWbEU9J-xUYOiKDWsIkyJiCpcdj-8Tw`
  readonly thanhSoSheetId = ``
  readonly memberThanhSoWorkbook: any;
  readonly selectedThanhSoWorkbook: any;
  readonly memberThanhSoOfWorkbook: any;
  readonly memberThanhSoList: any;
  readonly selectedThanhSoList: any;
  readonly memberThanhSoSetting: any;
  isActiveMemberThanhSoList: boolean = false;
  isActiveSelectedThanhSo: boolean = false;
  countSettingValueColIndex = 2

  constructor() {
  }

  getEventList() {
    this.eventList = FIXED_EVENT.data
  }
}
