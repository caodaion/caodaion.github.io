import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { CommonService } from './shared/services/common/common.service';
import { EventService } from './shared/services/event/event.service';
import { KinhService } from './shared/services/kinh/kinh.service';
import { Meta, Title } from "@angular/platform-browser";
import { CONSTANT } from "./shared/constants/constants.constant";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gettingCommonData: boolean = true
  eventList = <any>[]

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private kinhService: KinhService,
    private eventService: EventService,
    private meta: Meta,
    private route: ActivatedRoute,
    private title: Title,
    private datePipe: DatePipe
  ) {
    router.events.subscribe((val: any) => {
      localStorage.setItem(
        'currentLayout',
        JSON.stringify({
          isHideToolbar: false,
          isHideBottomNavBar: false,
        })
      );
      this.authService.getCurrentUser();
    });
    this.addTag()
  }

  ngOnInit(): void {
    this.gettingCommonData = true
    this.commonService.getTimeList().subscribe((res: any) => {
      if (res) {
        this.commonService.commonTimes = res.data;
        this.commonService.getLocationTypeList().subscribe((res: any) => {
          if (res) {
            this.commonService.commonLocationTypes = res.data;
            this.commonService.getDateList().subscribe((res: any) => {
              if (res) {
                this.commonService.commonDates = res.data;
                for (let i = 1; i <= 31; i++) {
                  if (i <= 12) {
                    this.commonService.commonDates.month.push({
                      key: i < 10 ? `0${i}` : i.toString(),
                      name: `tháng ${i}`,
                    });
                  }
                  this.commonService.commonDates.date.push({
                    key: i < 10 ? `0${i}` : i.toString(),
                    name: i,
                  });
                }
                this.kinhService.getKinhList()
                  .subscribe((res: any) => {
                    if (res) {
                      this.kinhService.kinhList = res.data;
                      this.kinhService.kinhList.forEach((item: any) => {
                        this.kinhService.getKinhContent(item.key).subscribe()
                      })
                      this.eventService.getEventList().subscribe((res: any) => {
                        if (res) {
                          this.eventService.eventList = res.data;
                          this.eventList = res.data;
                          this.gettingCommonData = false
                          this.checkPushNotification()
                        }
                      });
                    }
                  });
              }
            })
          }
        })
      }
    });
  }

  private addTag() {
    this.meta.addTag({ name: 'description', content: CONSTANT.page.description })
    this.meta.addTag({ name: 'title', content: CONSTANT.page.name })
    this.meta.addTag({ name: 'og:title', content: CONSTANT.page.name })
    this.meta.addTag({ name: 'og:url', content: location.origin })
    this.meta.addTag({ name: 'og:image', content: `https://www.caodaion.com/assets/icons/windows11/Square150x150Logo.scale-400.png` })
    this.meta.addTag({ name: 'og:image:secure_url', content: `https://www.caodaion.com/assets/icons/windows11/Square150x150Logo.scale-400.png` })
    this.meta.addTag({ name: 'image', content: `https://www.caodaion.com/assets/icons/windows11/Square150x150Logo.scale-400.png` })
    this.meta.addTag({ name: 'twitter:image', content: `https://www.caodaion.com/assets/icons/windows11/Square150x150Logo.scale-400.png` })
  }

  checkPushNotification() {
    const pushNotification = JSON.parse(localStorage.getItem('pushNotification') || '[]')
    const pushNotificationsSettings = JSON.parse(localStorage.getItem('pushNotificationsSettings') || '{}')
    const tuThoiEvents = this.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    tuThoiEvents?.filter((item: any) => {
      return pushNotificationsSettings?.tuThoi?.includes(item?.key)
    })?.forEach((item: any) => {
      const title = `Thông báo ${item?.name}`
      const nowTime = new Date()
      const notificationAt = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(0, 2)}:00:00`)
      notificationAt.setMinutes(notificationAt.getMinutes() - (pushNotificationsSettings.tuThoiDuration || 10))
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
}
