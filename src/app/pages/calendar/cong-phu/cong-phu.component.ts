import { DatePipe } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CongPhuService } from 'src/app/shared/services/cong-phu/cong-phu.service';

@Component({
    selector: 'app-cong-phu',
    templateUrl: './cong-phu.component.html',
    styleUrls: ['./cong-phu.component.scss'],
    standalone: false
})
export class CongPhuComponent implements AfterViewInit {
  saved: any = <any>{}
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  currentUser: any = <any>{}
  congPhuSetting: any = <any>{}
  syncGoogleFormPath: any;

  constructor(
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private congPhuService: CongPhuService
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
    const localCongPhuData = localStorage.getItem('congPhuData') || '{}'
    this.saved.name = JSON.parse(localCongPhuData)?.na
    this.saved.bornYear = JSON.parse(localCongPhuData)?.by
    this.saved.thanhThat = JSON.parse(localCongPhuData)?.tt
    this.fetchCongPhuData()
  }

  fetchCongPhuData() {
    this.congPhuService.fetchCongPhuData()
      .subscribe((res: any) => {
        this.congPhuSetting = res.setting
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
    this.syncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.congPhuSetting?.googleFormsId}/viewform`
    const syncToken = { 
      yy: this.saved.year, 
      mm: this.saved.month, 
      dd: this.saved.date, 
      ti: this.saved.time,
      no: this.saved.note,
      qa: this.saved.quality,
      fo: this.saved.focus,
    }
    this.syncGoogleFormPath += `?${this.congPhuSetting?.name}=${encodeURIComponent(JSON.stringify({
      na: this.saved.name,
      by: this.saved.bornYear,
      tt: this.saved.thanhThat
    }))}`;
    this.syncGoogleFormPath += `&${this.congPhuSetting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }

  updateName() {
    localStorage.setItem('congPhuData', JSON.stringify({
      na: this.saved.name,
      by: this.saved.bornYear,
      tt: this.saved.thanhThat
    }))
  }
}
