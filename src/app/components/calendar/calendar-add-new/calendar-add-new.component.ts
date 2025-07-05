import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
    selector: 'app-calendar-add-new',
    templateUrl: './calendar-add-new.component.html',
    styleUrls: ['./calendar-add-new.component.scss'],
    standalone: false
})
export class CalendarAddNewComponent implements OnInit {

  @Input() data = <any>{};
  @Output() save = new EventEmitter()
  recurringEventType = <any>[
    {
      key: '',
      name: 'Không lặp lại'
    },
    {
      key: 'RRULE:FREQ=DAILY',
      name: 'Mỗi ngày'
    },
    {
      key: 'RRULE:FREQ=WEEKLY',
      name: 'Mỗi tuần'
    },
    {
      key: 'RRULE:FREQ=MONTHLY',
      name: 'Mỗi tháng'
    },
    {
      key: 'RRULE:FREQ=YEARLY',
      name: 'Mỗi năm'
    }
  ]

  constructor(
    private datePipe: DatePipe,
    private calendarService: CalendarService
  ) {

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

  disabledSave() {
    let startDateValue = new Date(new Date(new Date(new Date(this.data.startDate).setHours(this.data.startTime.split(':')[0])).setMinutes(this.data.startTime.split(":")[1])).setSeconds(0))
    let endDateValue = new Date(new Date(new Date(new Date(this.data.endDate).setHours(this.data.endTime.split(':')[0])).setMinutes(this.data.endTime.split(":")[1])).setSeconds(59))
    return startDateValue > endDateValue || !this.data.text
  }

  saveEvent() {
    let startDateValue = new Date(new Date(new Date(new Date(this.data.startDate).setHours(this.data.startTime.split(':')[0])).setMinutes(this.data.startTime.split(":")[1])).setSeconds(0))
    let endDateValue = new Date(new Date(new Date(new Date(this.data.endDate).setHours(this.data.endTime.split(':')[0])).setMinutes(this.data.endTime.split(":")[1])).setSeconds(59))
    const request = <any>{
      text: this.data.text,
      dates: [startDateValue, endDateValue],
      subTitle: ''
    }
    if (this.data.recurring) {
      request.recur = this.data.recurring
    }
    if (this.data.endRepeatDate) {
      // @ts-ignore
      request.recur = `${request.recur};UNTIL=${this.data.endRepeatDate.toJSON().replaceAll('-', '').replaceAll(':', '').replaceAll('.', '').split('T')[0]}`
    }
    const url = this.calendarService.getGoogleCalendarEventEditUrl(request)
    window.open(url, '_blank')
    this.save.emit()
  }
}
