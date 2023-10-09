import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-add-new',
  templateUrl: './calendar-add-new.component.html',
  styleUrls: ['./calendar-add-new.component.scss']
})
export class CalendarAddNewComponent implements OnInit {

  @Input() data = <any>{};
  recurringEventType = <any>[
    {
      key: '',
      name: 'Không lặp lại'
    },
    {
      key: 'RRULE:FREQ=DAILY',
      name: 'Mỗi ngày'
    }
  ]

  constructor(private datePipe: DatePipe) {

  }


  ngOnInit(): void {
    if (!this.data.startDate) {
      const newDate = new Date()
      this.data.recurring = ''
      this.data.startDate = newDate
      this.data.endDate = newDate
      this.data.startTime = this.datePipe.transform(newDate, 'HH:mm')
      this.data.endTime = this.datePipe.transform(newDate, 'HH:mm')
    }
  }

  saveEvent() {
    let startDateValue = new Date(new Date(new Date(this.data.startDate).setHours(this.data.startTime.slice(0, 2))).setMinutes(this.data.startTime.slice(2, 2)))
    let endDateValue = new Date(new Date(new Date(this.data.endDate).setHours(this.data.endTime.slice(0, 2))).setMinutes(this.data.endTime.slice(2, 2)))
    const request = {
      text: this.data.text,
      dates: [startDateValue, endDateValue],
      subTitle: ''
    }
  }
}
