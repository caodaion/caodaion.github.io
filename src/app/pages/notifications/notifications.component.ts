import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  eventList = <any>[]
  tuthoiEvents = <any>[]
  pushNotificationsSettings = {
    tuThoi: <any>[]
  }

  constructor(
    private eventService: EventService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.getEvents()
  }

  getNotificationSettings() {
    const pushNotification = JSON.parse(localStorage.getItem('pushNotification') || '[]')
    this.pushNotificationsSettings = JSON.parse(localStorage.getItem('pushNotificationsSettings') || '{}')
    const tuThoiEvents = this.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    tuThoiEvents?.filter((item: any) => {
      return this.pushNotificationsSettings?.tuThoi?.includes(item?.key)
    })?.forEach((item: any) => {
      const nowTime = new Date()
      const title = `Thông báo ${item?.name}`
      const notificationAt = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(0, 2)}:00:00`)
      notificationAt.setMinutes(notificationAt.getMinutes() - 10)
      const payload = {
        body: `Hãy chuẩn bị ${item?.name} vào lúc ${this.datePipe.transform(notificationAt, 'HH:mm')}`,
        data: {
          url: `${location.origin}/lich/su-kien/cung-thoi-ty`
        },
        icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
        image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
      }
      Array.from(({ length: 7 }), (x, i) => {
        notificationAt.setDate(notificationAt.getDate() + (i == 0 ? 0 : 1))
        pushNotification.push({
          key: this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss'),
          title: title,
          payload: payload,
          notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss')
        })
      })
    })
    pushNotification?.forEach((item: any) => {
      console.log('Pushed Notification For: ', item);
      this.commonService.pushNotification(item?.title, item?.payload, new Date(item?.notificationAt), false)
    })
  }

  getEvents() {
    this.eventService.getEventList().subscribe((res: any) => {
      if (res) {
        this.eventList = res.data
        this.tuthoiEvents = this.eventList.find((item: any) => {
          return item.key === 'cung-tu-thoi'
        })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
        this.tuthoiEvents.forEach((item: any) => {
          item.startTime = `${item?.time[0].split('-')[1]?.slice(0, 2)}:00`
          item.endTime = `${item?.time[0].split('-')[1]?.slice(2, 4)}:00`
        })
        this.pushNotificationsSettings.tuThoi = this.tuthoiEvents.map((item: any) => {
          return {
            key: item?.key,
            name: item?.name,
            isActive: null,
          }
        })
        this.getNotificationSettings()
      }
    })
  }

  selectionChange() {
    localStorage.setItem('pushNotificationsSettings', JSON.stringify(this.pushNotificationsSettings))
    this.getNotificationSettings()
  }
}
