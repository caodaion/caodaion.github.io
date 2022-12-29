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
    tuThoi: <any>[],
    tuThoiDuration: 10
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
    this.tuThoiUpdate()
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

  tuThoiUpdate = () => {
    let pushNotification = JSON.parse(localStorage.getItem('pushNotification') || '[]')
    if (!this.pushNotificationsSettings.tuThoiDuration) {
      this.pushNotificationsSettings.tuThoiDuration = 10
    }
    const tuThoiEvents = this.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    tuThoiEvents?.filter((item: any) => {
      return this.pushNotificationsSettings?.tuThoi?.includes(item?.key)
    })?.forEach((item: any) => {
      const nowTime = new Date()
      const title = `Thông báo ${item?.name}`
      const correctPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(0, 2)}:00:00`)
        Array.from(({ length: 7 }), (x, i) => {
          if (!pushNotification) {
            pushNotification = []
          }
          const payload = {
            body: `Đã đến ${this.datePipe.transform(notificationAt, 'HH:mm')}, là giờ ${item?.name}`,
            data: {
              url: `${location.origin}/lich/su-kien/cung-thoi-ty`
            },
            icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
            image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
          }
          notificationAt.setDate(notificationAt.getDate() + (i == 0 ? 0 : 1))
          pushNotification.push({
            key: `${item?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: title,
            payload: payload,
            notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss')
          })
        })
      }
      correctPush()
      const awaitPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(0, 2)}:00:00`)
        Array.from(({ length: 7 }), (x, i) => {
          if (!pushNotification) {
            pushNotification = []
          }
          const payload = {
            body: `Hãy chuẩn bị ${item?.name} vào lúc ${this.datePipe.transform(notificationAt, 'HH:mm')}`,
            data: {
              url: `${location.origin}/lich/su-kien/cung-thoi-ty`
            },
            icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
            image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
          }
          notificationAt.setMinutes(notificationAt.getMinutes() - (this.pushNotificationsSettings?.tuThoiDuration || 10))
          notificationAt.setDate(notificationAt.getDate() + (i == 0 ? 0 : 1))
          pushNotification?.push({
            key: `${item?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: title,
            payload: payload,
            notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss')
          })
        })
      }
      awaitPush()
    })
    localStorage.setItem('pushNotification', JSON.stringify(''))
    if (pushNotification?.length > 0) {
      pushNotification?.forEach((item: any) => {
        if (item?.key?.includes('cung-thoi')) {
          if (this.pushNotificationsSettings.tuThoi.includes((item?.key?.split('.')[0]))) {
            // console.log('Pushed Notification For: ', item);
            this.commonService.pushNotification(item?.key, item?.title, item?.payload, new Date(item?.notificationAt), false)
          }
        } else {
          // console.log('Pushed Notification For: ', item);
          this.commonService.pushNotification(item?.key, item?.title, item?.payload, new Date(item?.notificationAt), false)
        }
      })
    }
  }

  selectionChange() {
    localStorage.setItem('pushNotificationsSettings', JSON.stringify(this.pushNotificationsSettings))
    this.tuThoiUpdate()
    this.getNotificationSettings()
  }

  changeDuration() {

  }
}
