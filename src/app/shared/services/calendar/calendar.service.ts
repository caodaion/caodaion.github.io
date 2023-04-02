import { Injectable } from '@angular/core';
import { map, Observable, observable, shareReplay, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
import { CommonService } from '../common/common.service';
import { DecimalPipe } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  commonTimes: any[] = [];
  commonLocationTypes: any[] = [];
  calendarViewMode: any = 'month';

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getConvertedFullDate(date?: any) {
    let comparedDate = null;
    if (date) {
      comparedDate = date;
    } else {
      comparedDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    }
    const PI = Math.PI;
    const INT = (d: any) => {
      /* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
      return Math.floor(d);
    };

    const getLunarYear = (year: any) => {
      let comparedDate = new Date();
      let lunarYear, can, chi;
      if (date) {
        comparedDate = date;
      }
      const cans = [
        { key: 'canh', name: 'Canh' },
        { key: 'tan', name: 'Tân' },
        { key: 'nham', name: 'Nhâm' },
        { key: 'quy', name: 'Quý' },
        { key: 'giap', name: 'Giáp' },
        { key: 'at', name: 'Ấy' },
        { key: 'binh', name: 'Bính' },
        { key: 'dinh', name: 'Đinh' },
        { key: 'mau', name: 'Mậu' },
        { key: 'ky', name: 'Kỷ' },
      ];
      const chis = [
        { key: 'than', name: 'Thân' },
        { key: 'dau', name: 'Dậu' },
        { key: 'tuat', name: 'Tuất' },
        { key: 'hoi', name: 'Hợi' },
        { key: 'ti', name: 'Tí' },
        { key: 'suu', name: 'Sửu' },
        { key: 'dan', name: 'Dần' },
        { key: 'mao', name: 'Mão' },
        { key: 'thin', name: 'Thìn' },
        { key: 'ty', name: 'Tỵ' },
        { key: 'ngo', name: 'Ngọ' },
        { key: 'mui', name: 'Mùi' },
      ];
      can = cans[year % 10];
      chi = chis[year % 12];
      lunarYear = {
        key: `${can.key}-${chi.key}`,
        name: `${can.name} ${chi.name}`,
      };
      return lunarYear;
    };

    const jdFromDate = (dd: any, mm: any, yy: any) => {
      /* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
       * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
       * Formula from http://www.tondering.dk/claus/calendar.html
       */
      let a, y, m, jd;
      a = INT((14 - mm) / 12);
      y = yy + 4800 - a;
      m = mm + 12 * a - 3;
      jd =
        dd +
        INT((153 * m + 2) / 5) +
        365 * y +
        INT(y / 4) -
        INT(y / 100) +
        INT(y / 400) -
        32045;
      if (jd < 2299161) {
        jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
      }
      return jd;
    };

    const jdToDate = (jd: any) => {
      /* Convert a Julian day number to day/month/year. Parameter jd is an integer */
      let a, b, c, d, e, m, day, month, year;
      if (jd > 2299160) {
        // After 5/10/1582, Gregorian calendar
        a = jd + 32044;
        b = INT((4 * a + 3) / 146097);
        c = a - INT((b * 146097) / 4);
      } else {
        b = 0;
        c = jd + 32082;
      }
      d = INT((4 * c + 3) / 1461);
      e = c - INT((1461 * d) / 4);
      m = INT((5 * e + 2) / 153);
      day = e - INT((153 * m + 2) / 5) + 1;
      month = m + 3 - 12 * INT(m / 10);
      year = b * 100 + d - 4800 + INT(m / 10);
      return new Array(day, month, year);
    };

    const NewMoon = (k: any) => {
      /* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
       * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
       * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
       * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
       */
      let T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
      T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
      T2 = T * T;
      T3 = T2 * T;
      dr = PI / 180;
      Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
      Jd1 =
        Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
      M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
      Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
      F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
      C1 =
        (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
        0.0021 * Math.sin(2 * dr * M);
      C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
      C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
      C1 =
        C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
      C1 =
        C1 -
        0.0074 * Math.sin(dr * (M - Mpr)) +
        0.0004 * Math.sin(dr * (2 * F + M));
      C1 =
        C1 -
        0.0004 * Math.sin(dr * (2 * F - M)) -
        0.0006 * Math.sin(dr * (2 * F + Mpr));
      C1 =
        C1 +
        0.001 * Math.sin(dr * (2 * F - Mpr)) +
        0.0005 * Math.sin(dr * (2 * Mpr + M));
      if (T < -11) {
        deltat =
          0.001 +
          0.000839 * T +
          0.0002261 * T2 -
          0.00000845 * T3 -
          0.000000081 * T * T3;
      } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
      }
      JdNew = Jd1 + C1 - deltat;
      return JdNew;
    };
    const SunLongitude = (jdn: any) => {
      /* Compute the longitude of the sun at any time.
       * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
       * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
       */
      let T, T2, dr, M, L0, DL, L;
      T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
      T2 = T * T;
      dr = PI / 180; // degree to radian
      M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
      L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
      DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
      DL =
        DL +
        (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
        0.00029 * Math.sin(dr * 3 * M);
      L = L0 + DL; // true longitude, degree
      L = L * dr;
      L = L - PI * 2 * INT(L / (PI * 2)); // Normalize to (0, 2*PI)
      return L;
    };

    const getSunLongitude = (dayNumber: any, timeZone: any) => {
      /* Compute sun position at midnight of the day with the given Julian day number.
       * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
       * The function returns a number between 0 and 11.
       * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
       * After that, return 1, 2, 3 ...
       */
      return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6);
    };

    const getNewMoonDay = (k: any, timeZone: any) => {
      /* Compute the day of the k-th new moon in the given time zone.
       * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
       */
      return INT(NewMoon(k) + 0.5 + timeZone / 24);
    };

    const getLunarMonth11 = (yy: any, timeZone: any) => {
      /* Find the day that starts the luner month 11 of the given year for the given time zone */
      let k, off, nm, sunLong;
      //off = jdFromDate(31, 12, yy) - 2415021.076998695;
      off = jdFromDate(31, 12, yy) - 2415021;
      k = INT(off / 29.530588853);
      nm = getNewMoonDay(k, timeZone);
      sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
      if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
      }
      return nm;
    };

    const getLeapMonthOffset = (a11: any, timeZone: any) => {
      /* Find the index of the leap month after the month starting on the day a11. */
      let k, last, arc, i;
      k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
      last = 0;
      i = 1; // We start with the month following lunar month 11
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
      do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
      } while (arc != last && i < 14);
      return i - 1;
    };

    const convertSolar2Lunar = (dd: any, mm: any, yy: any, timeZone: any) => {
      /* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
      let k,
        dayNumber,
        monthStart,
        a11,
        b11,
        lunarDay,
        lunarMonth,
        lunarYear,
        lunarLeap;
      dayNumber = jdFromDate(dd, mm, yy);
      k = INT((dayNumber - 2415021.076998695) / 29.530588853);
      monthStart = getNewMoonDay(k + 1, timeZone);
      if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
      }
      //alert(dayNumber+" -> "+monthStart);
      a11 = getLunarMonth11(yy, timeZone);
      b11 = a11;
      if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
      } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
      }
      lunarDay = dayNumber - monthStart + 1;
      let diff = INT((monthStart - a11) / 29);
      lunarLeap = 0;
      lunarMonth = diff + 11;
      if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
          lunarMonth = diff + 10;
          if (diff == leapMonthDiff) {
            lunarLeap = 1;
          }
        }
      }
      if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
      }
      if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
      }
      return {
        lunarDay,
        lunarMonth,
        lunarYear,
        lunarYearName: getLunarYear(lunarYear).name,
        lunarLeap,
      };
    };

    const convertLunar2Solar = (
      lunarDay: any,
      lunarMonth: any,
      lunarYear: any,
      lunarLeap: any,
      timeZone: any
    ) => {
      /* Convert a lunar date to the corresponding solar date */
      var k, a11, b11, off, leapOff, leapMonth, monthStart;
      if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1, timeZone);
        b11 = getLunarMonth11(lunarYear, timeZone);
      } else {
        a11 = getLunarMonth11(lunarYear, timeZone);
        b11 = getLunarMonth11(lunarYear + 1, timeZone);
      }
      k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
      off = lunarMonth - 11;
      if (off < 0) {
        off += 12;
      }
      if (b11 - a11 > 365) {
        leapOff = getLeapMonthOffset(a11, timeZone);
        leapMonth = leapOff - 2;
        if (leapMonth < 0) {
          leapMonth += 12;
        }
        if (lunarLeap != 0 && lunarMonth != leapMonth) {
          return new Array(0, 0, 0);
        } else if (lunarLeap != 0 || off >= leapOff) {
          off += 1;
        }
      }
      monthStart = getNewMoonDay(k + off, timeZone);
      return jdToDate(monthStart + lunarDay - 1);
    };
    let result = {
      convertSolar2Lunar: {
        lunarDay: 0,
        lunarMonth: 0,
        lunarYear: 0,
        lunarYearName: '',
        lunarLeap: 0,
      },
      convertLunar2Solar: jdToDate(0 + 0 - 1)
    }
    if (Date.parse(comparedDate)) {
      result.convertSolar2Lunar = convertSolar2Lunar(
        comparedDate.getDate() || new Date().getDate(),
        comparedDate.getMonth() + 1 || new Date().getMonth(),
        comparedDate.getFullYear() || new Date().getFullYear(),
        '+7'
      )
    } else {
      result.convertLunar2Solar = convertLunar2Solar(
        comparedDate.lunarDay,
        comparedDate.lunarMonth,
        comparedDate.lunarYear,
        0,
        '+7'
      )
    }
    return result;
  }

  getSelectedMonthCalendar(mm?: any, yy?: any): Array<any> {
    let comparedMonth = new Date().getMonth() + 1;
    let comparedYear = new Date().getFullYear();
    let selectedMonth: any[] = [];
    if (mm) {
      comparedMonth = mm;
    }
    if (yy) {
      comparedYear = yy;
    }

    const getMonday = (date: any) => {
      var day = date.getDay() || 7;
      if (day !== 1) date.setHours(-24 * (day - 1));
      return date;
    };
    for (
      let d = getMonday(new Date(`${comparedYear}-${comparedMonth}-01`));
      d <=
      new Date(
        comparedYear,
        comparedMonth - 1,
        new Date(comparedYear, comparedMonth, 0).getDate() +
        (7 - new Date(comparedYear, comparedMonth, 0).getDay())
      );
      d.setDate(d.getDate() + 1)
    ) {
      selectedMonth.push({
        solar: new Date(d),
        lunar: this.getConvertedFullDate(d),
      });
    }
    console.log(selectedMonth);
    return selectedMonth;
  }

  getTuanCuuEvents(date: any): Observable<any> {
    let events = <any>[]
    const eventCount = 9
    const startDate = date
    Array.from({length: eventCount}, (x, i) => {
      i++
      switch (i) {
        case 1: {
          const calDate = new Date(startDate.setDate(startDate.getDate() + 8))
          events.push(
            {
              solar: calDate,
              lunar: this.getConvertedFullDate(calDate).convertSolar2Lunar,
              eventName: `Khai Cửu`
            }
          )
          break;
        }
        // case 10: {
        //   const calcDate = this.getConvertedFullDate({
        //     lunarDay: date.lunarDay,
        //     lunarMonth: date.lunarMonth,
        //     lunarYear: date.lunarYear + 1
        //   }).convertLunar2Solar
        //   const solar = new Date(`${calcDate[2]}-${calcDate[1] > 9 ? '0' + calcDate[1] : calcDate[1]}-${calcDate[0] > 9 ? '0' + calcDate[0] : calcDate[0]}`)
        //   events.push({
        //       lunar: this.getConvertedFullDate(solar).convertSolar2Lunar,
        //       solar: solar,
        //       eventName: `Tiểu Tường`
        //     })
        //   break;
        // }
        // case 11: {
        //   const calcDate = this.getConvertedFullDate({
        //     lunarDay: date.lunarDay,
        //     lunarMonth: date.lunarMonth,
        //     lunarYear: date.lunarYear + 2
        //   }).convertLunar2Solar
        //   const solar = new Date(`${calcDate[2]}-${calcDate[1] > 9 ? '0' + calcDate[1] : calcDate[1]}-${calcDate[0] > 9 ? '0' + calcDate[0] : calcDate[0]}`)
        //   events.push({
        //       lunar: this.getConvertedFullDate(solar).convertSolar2Lunar,
        //       solar: solar,
        //       eventName: `Đại Tường`
        //     })
        //   break;
        // }
        default: {
          const calDate = new Date(startDate.setDate(startDate.getDate() + 9))
          events.push(
            {
              solar: calDate,
              lunar: this.getConvertedFullDate(calDate).convertSolar2Lunar,
              eventName: i < 9 ? `Đệ ${this.commonService.convertNumberToText(i).lunar} Cửu` : 'Chung Cửu'
            }
          )
          break;
        }
      }
    })
    return new Observable((observer) => {
      observer.next(events)
    });
  }
}
