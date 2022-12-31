import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { EventService } from '../event/event.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  pushNotificationsSettings: any;
  pushedNotification = <any>[]
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private eventService: EventService
  ) {
  }

  getPushNotificationSettings() {
    this.pushNotificationsSettings = new PushNotificationsSettingsModel(JSON.parse(localStorage.getItem('pushNotificationsSettings') || '{}'))
  }

  getPushedNotification() {
    this.pushedNotification = JSON.parse(localStorage.getItem('pushedNotification') || '[]')
    if (!this.pushedNotification) {
      this.pushedNotification = []
    }
  }

  pushNotification() {
    this.pushedNotification?.forEach((pushed: any) => {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          if (pushed.isforcePush) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(pushed.title, pushed.payload);
            });
            if (new Date(pushed.notificationAt) < new Date()) {
              // remove outdated notification
              this.pushedNotification.splice(this.pushedNotification.indexOf(this.pushedNotification.find((item: any) => item.key == pushed.key)), 1)
            }
          } else {
            if (new Date(pushed.notificationAt) < new Date()) {
              // remove outdated notification
              this.pushedNotification.splice(this.pushedNotification.indexOf(this.pushedNotification.find((item: any) => item.key == pushed.key)), 1)
            } else {
              const notificationTimeout = new Date(pushed.notificationAt).getTime() - new Date().getTime()
              setTimeout(() => {
                navigator.serviceWorker.ready.then((registration) => {
                  registration.showNotification(pushed.title, pushed.payload);
                });
              }, notificationTimeout)
            }
          }
        }
        localStorage.setItem('pushedNotification', JSON.stringify(this.pushedNotification))
      });
    })
    localStorage.setItem('pushedNotification', JSON.stringify(this.pushedNotification))
    this.getPushed()
  }

  private syncTuThoiPush() {
    const newPushed = <any>[]
    const tuThoiEvents = this.eventService.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')?.filter((item: any) => {
      return this.pushNotificationsSettings?.tuThoi?.pushed?.includes(item?.key)
    })
    tuThoiEvents.forEach((event: any) => {
      const correntPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(new Date(), 'yyyy-MM-dd')} ${event.time[0].split('-')[1].slice(0, 2)}:00:00`)
        for (let i = 0; i <= 7; i++) {
          notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
          const pushedData = {
            key: `${event?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: `Thông báo ${event?.name}`,
            notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss'),
          }
          if (this.pushNotificationsSettings?.tuThoi?.pushed?.includes(event.key)) {
            newPushed.push(pushedData)
          }
        }
      }
      const awaitPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(new Date(), 'yyyy-MM-dd')} ${event.time[0].split('-')[1].slice(0, 2)}:00:00`)
        notificationAt.setMinutes(notificationAt.getMinutes() - this.pushNotificationsSettings.tuThoi.duration || 10)
        for (let i = 0; i <= 7; i++) {
          notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
          const pushedData = {
            key: `${event?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: `Thông báo ${event?.name}`,
            notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss'),
          }
          if (this.pushNotificationsSettings?.tuThoi?.pushed?.includes(event.key)) {
            newPushed.push(pushedData)
          }
        }
      }
      correntPush()
      awaitPush()
    })
    this.pushedNotification = newPushed
  }

  addNewPush(data: Array<any>) {
    this.getPushed()
    if (!!data) {
      data.forEach((item: any) => {
        if (!this.pushedNotification.find((p: any) => p.key == item?.key)) {
          this.pushedNotification.push(item)
        }
      })
      this.pushNotification()
    }
  }

  getPushed() {
    this.getPushNotificationSettings()
    this.getPushedNotification()
  }

  syncPush() {
    this.getPushed()
    this.syncTuThoiPush()
    this.pushNotification()
  }

  updatePushSettings(settings: any) {
    this.pushNotificationsSettings = settings
    localStorage.setItem('pushNotificationsSettings', JSON.stringify(this.pushNotificationsSettings))
    this.syncTuThoiPush()
    this.pushNotification()
  }
}

class PushNotificationsSettingsModel {
  tuThoi = {
    duration: <number>10,
    pushed: <any>[],
  }
  constructor(entry?: any) {
    if (entry.tuThoi) {
      this.tuThoi = entry.tuThoi
    }
  }
}
