import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FIXED_EVENT } from '../../constants/master-data/fixed-event.constant';
import { read, utils } from 'xlsx';
import { SheetService } from '../sheet/sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: any[] = [];
  readonly sheetId = `2PACX-1vSRtHl3pP1qRsmnajbePLYP4lUj8YNdmCwZLqVoT9o2Q9KZ6eWbEU9J-xUYOiKDWsIkyJiCpcdj-8Tw`
  readonly thanhSoSheet = `Form Responses 1`
  readonly thanhSoSettingSheet = `centerDatabase`
  readonly memberThanhSoWorkbook: any;
  readonly selectedThanhSoWorkbook: any;
  readonly memberThanhSoOfWorkbook: any;
  readonly memberThanhSoList: any;
  readonly selectedThanhSoList: any;
  readonly memberThanhSoSetting: any;
  isActiveMemberThanhSoList: boolean = false;
  isActiveSelectedThanhSo: boolean = false;
  countSettingValueColIndex = 2

  constructor(private sheetService: SheetService) {
  }

  getEventList() {
    this.eventList = FIXED_EVENT.data
  }

  fetchRegisteredMember(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.memberThanhSoWorkbook.Sheets[this.thanhSoSettingSheet])
          .subscribe((res: any) => {
            const settingData = res;
            if (settingData?.length > 0) {
              response.status = 200
              response.setting = <any>{}
              settingData?.forEach((item: any) => {
                response.setting[item?.field] = item?.trigger
              })
              this.sheetService.decodeRawSheetData(ref.memberThanhSoWorkbook.Sheets[this.thanhSoSheet])
                .subscribe((res: any) => {
                  const registeredData = res;
                  response.data = registeredData
                  observable.next(response)
                  observable.complete()
                })
            }
          })
      }
      if (!ref.memberThanhSoWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.memberThanhSoWorkbook = res?.workbook
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

  fetchThanhSoEvent(id: any): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.selectedThanhSoWorkbook.Sheets['setting'])
          .subscribe((res: any) => {
            const settingData = res;
            if (settingData?.length > 0) {
              response.status = 200
              response.setting = <any>{}
              settingData?.forEach((item: any) => {
                response.setting[item?.field] = item?.trigger
              })
              this.sheetService.decodeRawSheetData(ref.selectedThanhSoWorkbook.Sheets['Form Responses 1'])
                .subscribe((res: any) => {
                  const data = res;
                  response.data = data
                  observable.next(response)
                  observable.complete()
                })
            }
          })
      }
      if (!ref.selectedThanhSoWorkbook) {
        try {
          this.sheetService.fetchSheet(id)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.selectedThanhSoWorkbook = res?.workbook
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
