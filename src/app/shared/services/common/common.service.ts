import { Injectable } from '@angular/core';
import { map, Observable, observable, shareReplay, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  commonTimes: any[] = [];
  commonLocationTypes: any[] = [];
  commonDates: any;

  constructor(private http: HttpClient) { }

  getTimeList(): Observable<any> {
    return this.http
      .get(`assets/documents/master-data/time.json`);
  }

  getLocationTypeList(): Observable<any> {
    return this.http
      .get(`assets/documents/master-data/location-type.json`);
  }

  getDateList(): Observable<any> {
    return this.http
      .get(`assets/documents/master-data/date.json`);
    // .subscribe((res: any) => {
    //   if (res) {
    //     this.commonDates = res.data;
    //     for (let i = 1; i <= 31; i++) {
    //       if (i <= 12) {
    //         this.commonDates.month.push({
    //           key: i < 10 ? `0${i}` : i.toString(),
    //           name: `tháng ${i}`,
    //         });
    //       }
    //       this.commonDates.date.push({
    //         key: i < 10 ? `0${i}` : i.toString(),
    //         name: i,
    //       });
    //     }
    //   }
    // });
  }

  getCommonTimeValue(time: any): any {
    let timeValue: any[] = [];
    if (time.length > 0) {
      switch (time[0]) {
        case 'all':
          timeValue = this.commonTimes.map((item: any) => item.key);
          break;
        case 'tu-thoi':
          timeValue = this.commonTimes
            .filter(
              (item: any) =>
                item.key === 'tu-thoi' ||
                item.key === 'ty-2301' ||
                item.key === 'meo-0507' ||
                item.key === 'ngo-1113' ||
                item.key === 'dau-1719'
            )
            .map((item: any) => item.key);
          break;
        default:
          timeValue = time;
          break;
      }
    } else {
      timeValue = time;
    }
    return timeValue;
  }

  getCommonLocationTypeValue(location: any): any {
    let locationTypeValue: any[] = [];
    if (location.length > 0) {
      switch (location[0]) {
        case 'all':
          locationTypeValue = this.commonLocationTypes.map(
            (item: any) => item.key
          );
          break;
        default:
          locationTypeValue = location;
          break;
      }
    } else {
      locationTypeValue = location;
    }
    return locationTypeValue;
  }

  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map((tick) => new Date()),
    shareReplay(1)
  );

  get time() {
    return { commonTime: this.getTimeCurrentLunarTime(), time: this._time$ };
  }

  getTimeCurrentLunarTime() {
    let currentDate = new Date();
    let currentFoundTime = this.commonTimes
      ?.filter((item: any) => item.key !== 'all' && item.key !== 'tu-thoi')
      ?.find((item: any) => {
        return (
          currentDate >=
          new Date(
            new Date(
              `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${item.name
                .split('|')[1]
                .split('-')[0]
                .trim()}`
            )
          ) &&
          currentDate <=
          new Date(
            new Date(
              new Date(
                `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${item.name
                  .split('|')[1]
                  .split('-')[1]
                  .trim()}`
              )
            ).setSeconds(-1)
          )
        );
      });
    let currentTimeIndex = this.commonTimes.findIndex(
      (item) => item.key === currentFoundTime?.key
    );
    const getUpcomingTime = () => {
      if (
        currentFoundTime?.key !== 'ty-2301' ||
        currentFoundTime?.key !== 'meo-0507' ||
        currentFoundTime?.key !== 'ngo-1113' ||
        currentFoundTime?.key !== 'dau-1719'
      ) {
        for (let i = currentTimeIndex; i < this.commonTimes.length; i++) {
          if (
            this.commonTimes[i]?.key === 'ty-2301' ||
            this.commonTimes[i]?.key === 'meo-0507' ||
            this.commonTimes[i]?.key === 'ngo-1113' ||
            this.commonTimes[i]?.key === 'dau-1719'
          ) {
            return this.commonTimes[i];
          }
          if (
            i > this.commonTimes.findIndex((item) => item.key === 'dau-1719')
          ) {
            return this.commonTimes.find((item: any) => item.key === 'ty-2301');
          }
        }
      } else {
        return currentFoundTime;
      }
    };
    return {
      current: currentFoundTime,
      kanji: currentFoundTime?.name.split('|')[0].trim(),
      tuThoiUpcoming: getUpcomingTime(),
    };
  }

  convertNumberToText(n: any) {
    const convertNumberGeaterThanTen = (n: any) => {
      return ''
    }
    let lunar = ''
    switch (n) {
      case 1:
        lunar = 'Nhất'
        break;
      case 2:
        lunar = 'Nhị'
        break;
      case 3:
        lunar = 'Tam'
        break;
      case 4:
        lunar = 'Tứ'
        break;
      case 5:
        lunar = 'Ngũ'
        break;
      case 6:
        lunar = 'Lục'
        break;
      case 7:
        lunar = 'Thất'
        break;
      case 8:
        lunar = 'Bát'
        break;
      case 9:
        lunar = 'Cửu'
        break;
      case 10:
        lunar = 'Thập'
        break;
      default:
        convertNumberGeaterThanTen(n)
        break;
    }
    return {
      lunar: lunar
    }
  }

  convertDay(day: any): any {
    switch (day.toLowerCase()) {
      case 'sun':
        return 'Chủ Nhật'
      case 'mon':
        return 'Thứ Hai'
      case 'tue':
        return 'Thứ Ba'
      case 'wed':
        return 'Thứ Tư'
      case 'thu':
        return 'Thứ Năm'
      case 'fri':
        return 'Thứ Sáu'
      case 'sat':
        return 'Thứ Bảy'
      default:
        return day
    }
  }
}
