import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { CommonService } from './shared/services/common/common.service';
import { EventService } from './shared/services/event/event.service';
import { KinhService } from './shared/services/kinh/kinh.service';
import { Meta } from "@angular/platform-browser";
import { CONSTANT } from "./shared/constants/constants.constant";
import { NotificationsService } from './shared/services/notifications/notifications.service';
import { TnhtService } from './shared/services/tnht/tnht.service';

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
    private notificationsService: NotificationsService,
    private tnhtService: TnhtService,
  ) {
    this.router.events.subscribe((val: any) => {
      localStorage.setItem(
        'currentLayout',
        JSON.stringify({
          isHideToolbar: false,
          isHideBottomNavBar: false,
        })
      );
      this.authService.getCurrentUser();
    });
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
                      fetch(`src/assets/audios/aud-7-chakra-5-bowl-39233.mp3`)
                      this.kinhService.kinhList.forEach((item: any) => {
                        this.kinhService.getKinhContent(item.key).subscribe()
                      })
                      this.eventService.getEventList().subscribe((res: any) => {
                        if (res) {
                          this.eventService.eventList = res.data;
                          this.eventList = res.data;
                          this.gettingCommonData = false
                          this.tnhtService.getTNHTByPath('quyen-1').subscribe((res: any) => {
                            if (res.data) {
                              this.tnhtService.tableContent = res.data
                              this.tnhtService.tableContent?.content?.forEach((item: any) => {
                                if (item?.audio?.src) {
                                  fetch(item?.audio?.src)
                                }
                              })
                              this.checkPushNotification()
                            }
                          })
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
    this.addTag()
  }

  checkPushNotification() {
    this.notificationsService.syncPush()
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
}
