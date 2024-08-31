import { DatePipe } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
  selector: 'app-cong-phu',
  templateUrl: './cong-phu.component.html',
  styleUrls: ['./cong-phu.component.scss']
})
export class CongPhuComponent implements AfterViewInit {
  saved: any = <any>{}
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  currentUser: any = <any>{}
  syncGoogleFormPath: any;

  constructor(
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {

  }

  ngAfterViewInit(): void {
    const now = new Date()
    this.saved.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.saved.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.saved.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
    this.saved.time = this.datePipe.transform(now, 'HH:mm')
    this.getYearOptions();
    this.authService.getCurrentUser(true).subscribe((res: any) => {
      this.currentUser = res;
    })
  }

  savedSummary() {
    let innerHtmlContent = 'Ghi lại về'
    if (this.saved.date && this.saved.month && this.saved.year && this.saved.time) {
      const compareDate = new Date(`${this.saved.year}-${this.saved.month}-${this.saved.date} ${this.saved.time.split(':')[0]}:${this.saved.date, this.saved.time.split(':')[1]}:00`);
      const lunarData = this.calendarService.getConvertedFullDate(compareDate).convertSolar2Lunar
      innerHtmlContent += ` thời <strong> ${lunarData.lunarTime}</strong> ngày <strong> ${lunarData.lunarDay}</strong> tháng <strong> ${lunarData.lunarMonth}</strong> năm <strong>${lunarData.lunarYearName}</strong>`
    }
    return innerHtmlContent;
  }

  getYearOptions() {
    for (let i = new Date().getFullYear() + 1; i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 31 }, (x, i) => i + 1)
  }

  saveData() {
    this.syncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.currentUser?.googleFormsId}/viewform`
    const syncToken = [{ key: 'cong-phu', data: this.saved }]
    this.syncGoogleFormPath += `?${this.currentUser?.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }
}
