import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
    selector: 'app-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss'],
    standalone: false
})
export class TimeComponent implements OnInit {
  time = this.commonService.time;
  nowDate: any;
  dateWeek: any;

  constructor(
    private commonService: CommonService,
    private calendarService: CalendarService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.nowDate = {
      lunar: this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar,
      solar: new Date()
    }
    const data = this.datePipe.transform(this.nowDate.solar, 'EEE')
    let dateSet = <any>{
      mon: 'Thứ Hai',
      tue: 'Thứ Ba',
      wed: 'Thứ Tư',
      thu: 'Thứ Năm',
      fri: 'Thứ Sáu',
      sat: 'Thứ Bảy',
      sun: 'Chủ Nhật',
    }
    this.dateWeek = dateSet[`${data?.toLowerCase()}`]
  }
}
