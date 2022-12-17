import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-tinh-tuan-cuu',
  templateUrl: './tinh-tuan-cuu.component.html',
  styleUrls: ['./tinh-tuan-cuu.component.scss']
})
export class TinhTuanCuuComponent implements OnInit {

  selectedDate = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  tuanCuuEvents = <any>[];
  displayedColumns: string[] = ['eventName', 'day', 'lunar', 'solar'];
  constructor(
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    this.route.queryParams.subscribe((param: any) => {
      if (param['y']) {
        this.selectedDate.lunarYear = param['y'];
      }
      if (param['m']) {
        this.selectedDate.lunarMonth = param['m'];
      }
      if (param['d']) {
        this.selectedDate.lunarDay = param['d'];
      }
      if (param['y'] && param['m'] && param['d']) {
        this.calculateTuanCuu()
      }
    })
  }

  getYearOptions() {
    for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        lunar: convertedDate.convertSolar2Lunar.lunarYearName,
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 30 }, (x, i) => i + 1)
  }

  calculateTuanCuu() {
    this.calendarService.getTuanCuuEvents(this.selectedDate)
      .subscribe((res: any) => {
        if (res) {
          res.forEach((item: any) => {
            item.day = this.commonService.convertDay(this.datePipe.transform(item.solar, 'EEE'))
          })
          res.push({
            lunar: `${this.selectedDate.lunarDay}-${this.selectedDate.lunarMonth} ${this.calendarService.getConvertedFullDate(new Date(this.selectedDate.lunarYear + 1, this.selectedDate.lunarMonth, this.selectedDate.lunarDay)).convertSolar2Lunar.lunarYearName}`,
          })
          this.tuanCuuEvents = res
        }
      })
  }
}
