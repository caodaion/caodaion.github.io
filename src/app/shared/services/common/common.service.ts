import { Injectable } from '@angular/core';
import { map, Observable, observable, shareReplay, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { DatePipe } from '@angular/common';
import { TIME_TYPE } from '../../constants/master-data/time-type.constant'
import { LOCATION_TYPE } from '../../constants/master-data/location-type.constant';
import { DATE_TYPE } from '../../constants/master-data/date-type.constant';
import { SheetService } from '../sheet/sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  commonTimes: any[] = [];
  commonLocationTypes: any[] = [];
  commonDates: any;
  readonly provinceWorkbook: any;
  readonly provinces: any[] = [];
  readonly districts: any[] = [];
  readonly wards: any[] = [];
  readonly provinceSheet: any = 'Sheet1';
  readonly sheetId: any = '2PACX-1vTuBg5iLvvvpcufTuOghQ4H1INXABXCtUaRaeBd8-9h5Gp2Ju2MFURK6cZAMvtU9Q';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private sheetService: SheetService
  ) {
    this.commonTimes = TIME_TYPE.data
    this.commonLocationTypes = LOCATION_TYPE.data
    this.commonDates = DATE_TYPE.data
    for (let i = 1; i <= 31; i++) {
      if (i <= 12) {
        this.commonDates.month.push({
          key: i < 10 ? `0${i}` : i.toString(),
          name: `tháng ${i}`,
        });
      }
      this.commonDates.date.push({
        key: i < 10 ? `0${i}` : i.toString(),
        name: i,
      });
    }
  }

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
    return { commonTime: this.getTimeLunarTime(), time: this._time$ };
  }

  getTimeLunarTime(time?: Date) {
    let currentDate = new Date();
    if (time) {
      currentDate = time
    }
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

  convertNumberToText(n: any, ignoreDeSe: boolean = false, option?: any) {
    const convertSplitToText = (num: any) => {
      let lunar = ''
      switch (num) {
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
          break;
      }
      return lunar
    }
    const convertNumber = (n: any) => {
      const decimalSeparator = ['ức', 'thập vạn', 'vạn', 'thiên', 'bách', 'thập']
      const splitValue = n.toString().trim().split('')
      let returnValue = ''
      for (let index = decimalSeparator.length - 1; index >= splitValue.length; index--) {
        decimalSeparator.shift()
      }
      if (splitValue?.length > 1) {
        for (let index = splitValue.length - 1; index >= 0; index--) {
          let item = splitValue[index]
          let value = convertSplitToText(parseInt(item))
          if (ignoreDeSe) {
            value = index < splitValue.length - 1 && item == 1 ? '' : convertSplitToText(parseInt(item)).toLowerCase()
          }
          const noNeedDeSe = !value && !convertSplitToText(parseInt(splitValue[index - 1]))
          returnValue = (index === 0 ? '' : noNeedDeSe ? '' : decimalSeparator[index]) + ' ' + value + ' ' + returnValue
        }
      } else {
        returnValue = option?.type == 'month' && parseInt(splitValue[0]) == 1 ? 'Chánh' : option?.type == 'date' && parseInt(splitValue[0]) < 10 ? 'sơ ' + convertSplitToText(parseInt(splitValue[0])) : convertSplitToText(parseInt(splitValue[0]))
      }
      return returnValue.split(/\s+/).join(' ').trim();
    }
    return convertNumber(n)
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

  fetchProvinceData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.provinceWorkbook.Sheets[this.provinceSheet])
          .subscribe((res: any) => {
            const provinceData = res;
            if (provinceData?.length > 0) {
              response.status = 200
              provinceData?.forEach((item: any) => {
                if (!ref.provinces?.find((p: any) => p?.id == item?.provinceId)) {
                  ref.provinces?.push({ id: item?.provinceId, name: item?.province })
                }
                if (!ref.districts?.find((p: any) => p?.id == item?.districtId)) {
                  ref.districts?.push({ id: item?.districtId, name: item?.district, provinceId: item?.provinceId })
                }
                if (!ref.wards?.find((p: any) => p?.id == item?.wardId)) {
                  ref.wards?.push({ id: item?.wardId, name: item?.ward, level: item?.level, provinceId: item?.provinceId, districtId: item?.districtId })
                }
              })
              response.provinces = ref.provinces
              response.districts = ref.districts
              response.wards = ref.wards
              observable.next(response)
              observable.complete()
            }
          })
      }
      if (!ref.provinceWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.provinceWorkbook = res?.workbook
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
