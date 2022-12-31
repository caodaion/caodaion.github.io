import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { EventService } from '../event/event.service';
import { TnhtService } from '../tnht/tnht.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  pushNotificationsSettings: any;
  pushedNotification = <any>[]
  pushedTuThoi = <any>[]
  pushedStudy = <any>[]
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private eventService: EventService,
    private tnhtService: TnhtService,
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
    if (this.pushedNotification?.length > 0) {
      this.pushedTuThoi = this.pushedNotification.filter((item: any) => item?.key.includes('cung-thoi'))
    }
  }

  pushNotification() {
    this.pushedNotification = []
    this.pushedNotification = this.pushedTuThoi.concat(this.pushedStudy)
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
        for (let i = 0; i < 7; i++) {
          notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
          const payload = {
            body: `Đã đến ${this.datePipe.transform(notificationAt, 'HH:mm')}, là giờ ${event?.name}`,
            data: {
              url: `${location.origin}/lich/su-kien/${event?.key}`
            },
            icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
            image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
          }
          const pushedData = {
            key: `${event?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: `Thông báo ${event?.name}`,
            payload: payload,
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
        for (let i = 0; i < 7; i++) {
          notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
          const payload = {
            body: `Hãy chuẩn bị ${event?.name} vào lúc ${this.datePipe.transform(notificationAt, 'HH:mm')}`,
            data: {
              url: `${location.origin}/lich/su-kien/${event?.key}`
            },
            icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
            image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
          }
          const pushedData = {
            key: `${event?.key}.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
            title: `Thông báo ${event?.name}`,
            payload: payload,
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
    this.pushedTuThoi = newPushed
  }

  private syncStudyPush() {
    const newPushed = <any>[]
    const isStudying = JSON.parse(localStorage.getItem('study') || '{}')
    if (this.pushNotificationsSettings.study.active) {
      const correntPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(new Date(), 'yyyy-MM-dd')} ${this.pushNotificationsSettings.study.time}:00`)
        if (notificationAt) {
          for (let i = 0; i < 7; i++) {
            notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
            let payload = {
              body: "Đã đến giờ học hỏi thêm kiến thức mới",
              data: {
                url: `${location.origin}`
              },
              icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
              image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
            }
            if (isStudying?.content && isStudying?.location) {
              if (isStudying?.location.includes('thanh-ngon-hiep-tuyen')) {
                const find = (array: any, key: any) => {
                  let result: any;
                  array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
                  return result;
                }
                const foundContent = find(this.tnhtService.tableContent.content, isStudying?.content)
                payload = {
                  body: `Đã đến giờ tiếp tục học\nBạn đang học Thánh Ngôn Hiệp Tuyển > ${foundContent?.name}`,
                  data: {
                    url: isStudying?.location
                  },
                  icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
                  image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
                }
              }
            }
            let pushedData = {
              key: `tu-hoc.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
              title: `Thông báo tự học`,
              notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss'),
              payload: payload
            }
            newPushed.push(pushedData)
          }
        }
      }
      correntPush()
      const awaitPush = () => {
        const notificationAt = new Date(`${this.datePipe.transform(new Date(), 'yyyy-MM-dd')} ${this.pushNotificationsSettings.study.time}:00`)
        notificationAt.setMinutes(notificationAt.getMinutes() - this.pushNotificationsSettings.study.duration || 10)
        if (notificationAt) {
          for (let i = 0; i < 7; i++) {
            notificationAt.setDate(notificationAt.getDate() + (i === 0 ? 0 : 1))
            let payload = {
              body: `Hãy tự học hỏi thêm kiến thức mới sau ${this.pushNotificationsSettings.study.duration || 10} phút nữa`,
              data: {
                url: `${location.origin}`
              },
              icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
              image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
            }
            if (isStudying?.content && isStudying?.location) {
              if (isStudying?.location.includes('thanh-ngon-hiep-tuyen')) {
                const find = (array: any, key: any) => {
                  let result: any;
                  array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
                  return result;
                }
                const foundContent = find(this.tnhtService.tableContent.content, isStudying?.content)
                payload = {
                  body: `${this.pushNotificationsSettings.study.duration || 10} phút nữa là đến giờ tiếp tục tự học\nBạn đang học Thánh Ngôn Hiệp Tuyển > ${foundContent?.name}`,
                  data: {
                    url: isStudying?.location
                  },
                  icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
                  image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
                }
              }
            }

            let pushedData = {
              key: `tu-hoc.${this.datePipe.transform(notificationAt, 'yyyyMMddHHmmss')}`,
              title: `Thông báo tự học`,
              notificationAt: this.datePipe.transform(notificationAt, 'yyyy-MM-dd HH:mm:ss'),
              payload: payload
            }
            newPushed.push(pushedData)
          }
        }
      }
      awaitPush()
    }
    this.pushedStudy = newPushed
  }

  addNewPush(data: Array<any>) {
    this.getPushed()
    if (!!data) {
      data.forEach((item: any) => {
        if (item.key.includes('cung-thoi')) {
          if (!this.pushedTuThoi.find((p: any) => p.key == item?.key)) {
            this.pushedTuThoi.push(item)
          }
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
    this.syncStudyPush()
    this.pushNotification()
  }

  updatePushSettings(settings: any) {
    this.pushNotificationsSettings = settings
    localStorage.setItem('pushNotificationsSettings', JSON.stringify(this.pushNotificationsSettings))
    this.syncTuThoiPush()
    this.syncStudyPush()
    this.pushNotification()
  }
}

class PushNotificationsSettingsModel {
  tuThoi = {
    duration: <number>10,
    pushed: <any>[],
  }
  study = {
    duration: <number>10,
    time: <any>'06:00',
    active: <boolean>false,
  }
  constructor(entry?: any) {
    if (entry.tuThoi) {
      this.tuThoi = entry.tuThoi
    }
    if (entry.study) {
      this.study = entry.study
    }
  }
}
