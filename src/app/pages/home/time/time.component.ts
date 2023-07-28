import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {
  time = this.commonService.time;
  nowDate: any;
  dateWeek: any;

  constructor(
    private commonService: CommonService,
    private calendarService: CalendarService,
    private datePipe: DatePipe
  ) {
    this.nowDate = {
      lunar: this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar,
      solar: new Date()
    }
    switch (this.datePipe.transform(this.nowDate.solar, 'EEE')) {
      case 'Mon':
        this.dateWeek = 'Thứ Hai'
        break;
      case 'Tue':
        this.dateWeek = 'Thứ Ba'
        break;
      case 'Web':
        this.dateWeek = 'Thứ Tư'
        break;
      case 'Thu':
        this.dateWeek = 'Thứ Năm'
        break;
      case 'Fri':
        this.dateWeek = 'Thứ Sáu'
        break;
      case 'Sat':
        this.dateWeek = 'Thứ Bảy'
        break;
      case 'Sun':
        this.dateWeek = 'Chủ Nhật'
        break;
      default:
        this.dateWeek = ''
        break;
    }
  }


}
