import { Injectable } from '@angular/core';
import { map, Observable, observable, shareReplay, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  commonTimes: any[] = [];
  commonLocationTypes: any[] = [];
  commonDates: any;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

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

  public generatedSlug(text: any) {
    let slug;
    slug = text?.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug?.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug?.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug?.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug?.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug?.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug?.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug?.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug?.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    );
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug?.replace(/ /gi, '-');
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug?.replace(/\-\-\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug?.replace(/\@\-|\-\@|\@/gi, '');
    return slug
  }

  pushNotification(key: any, title: any, payload: any, notificationAt: Date, isforcePush: boolean = true) {
    if (new Date(notificationAt) < new Date()) {
      // remove outdated notification
      let pushNotification = JSON.parse(localStorage.getItem('pushNotification') || '')
      if (!pushNotification) {
        pushNotification = []
      }
      pushNotification.splice(pushNotification.indexOf(pushNotification.find((item: any) => item.key == key)), 1)
      localStorage.setItem('pushNotification', JSON.stringify(pushNotification))
    } else {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          if (isforcePush) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(title, payload);
            });
          } else {
            const notificationTimeout = notificationAt.getTime() - new Date().getTime()
            setTimeout(() => {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, payload);
              });
            }, notificationTimeout)
            let pushNotification = JSON.parse(localStorage.getItem('pushNotification') || '[]')
            if (!pushNotification) {
              pushNotification = []
            }
            if (!pushNotification?.find((p: any) => p?.key == key)) {
              pushNotification.push({
                key: key,
                title: title,
                payload: payload,
                notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss')
              })
            }
            localStorage.setItem('pushNotification', JSON.stringify(pushNotification))
          }
        }
      });
    }
  }
}
