import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
  selector: 'app-synchronized',
  templateUrl: './synchronized.component.html',
  styleUrls: ['./synchronized.component.scss']
})
export class SynchronizedComponent implements OnInit {

  cols: any;
  synchronizationList = <any>[
    {
      key: 'tu-thoi-ty',
      text: 'Cúng thời TÝ',
      subTitle: 'Cúng tứ thời',
      dates: ['ty-23-01'],
      recur: 'RRULE:FREQ=DAILY',
      details: ''
    },
    {
      key: 'tu-thoi-meo',
      text: 'Cúng thời MẸO',
      subTitle: 'Cúng tứ thời',
      dates: ['meo-05-07'],
      recur: 'RRULE:FREQ=DAILY',
      details: ''
    },
    {
      key: 'tu-thoi-ngo',
      text: 'Cúng thời NGỌ',
      subTitle: 'Cúng tứ thời',
      dates: ['ngo-11-13'],
      recur: 'RRULE:FREQ=DAILY',
      details: ''
    },
    {
      key: 'tu-thoi-dau',
      text: 'Cúng thời DẬU',
      subTitle: 'Cúng tứ thời',
      dates: ['dau-17-19'],
      recur: 'RRULE:FREQ=DAILY',
      details: ''
    }
  ]

  constructor(
    private breakpointObserver: BreakpointObserver,
    private calendarService: CalendarService
  ) {
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1;
        } else {
          this.cols = 6;
        }
      });
  }

  onOpenSynchronizeData(item: any) {
    const url = this.calendarService.getGoogleCalendarEventEditUrl(item)
    if (url) {
      window.open(url, '_blank');
    }
  }
}
