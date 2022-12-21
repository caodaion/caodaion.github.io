import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
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
    private route: ActivatedRoute,
    private titleService: Title
  ) {

  }

  ngOnInit(): void {
    this.getYearOptions()
    this.route.queryParams.subscribe((param: any) => {
      if (param['y']) {
        this.selectedDate.lunarYear = parseInt(param['y']);
      }
      if (param['m']) {
        this.selectedDate.lunarMonth = parseInt(param['m']);
      }
      if (param['d']) {
        this.selectedDate.lunarDay = parseInt(param['d']);
      }
      if (param['y'] && param['m'] && param['d']) {
        this.calculateTuanCuu()
      }
    })
    this.titleService.setTitle(`Tính Tuần Cửu | ${CONSTANT.page.name}`)
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
            item.day = this.commonService.convertDay(this.datePipe?.transform(item.solar, 'EEE'))
          })
          this.tuanCuuEvents = res
        }
      })
  }
}
