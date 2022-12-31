import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/services/event/event.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  pushNotificationsSettings: any;
  tuThoiEvents = <any>[]

  constructor(
    private notificationsService: NotificationsService,
    private eventService: EventService
    ) { }

  ngOnInit(): void {
    this.tuThoiEvents = this.eventService.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    this.tuThoiEvents?.forEach((item: any) => {
      item.startTime = `${item.time[0].split('-')[1]?.slice(0, 2)}:00`
      item.endTime = `${item.time[0].split('-')[1]?.slice(2, 4)}:00`
    })
    this.pushNotificationsSettings = this.notificationsService.pushNotificationsSettings
  }

  changeSetting() {
    const settings = this.pushNotificationsSettings;

    this.notificationsService.updatePushSettings(settings)
  }
}
