import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { CommonService } from './shared/services/common/common.service';
import { EventService } from './shared/services/event/event.service';
import { KinhService } from './shared/services/kinh/kinh.service';
import { Meta, Title } from "@angular/platform-browser";
import { CONSTANT } from "./shared/constants/constants.constant";
import { DatePipe } from '@angular/common';
import { NotificationsService } from './shared/services/notifications/notifications.service';
import { TnhtService } from './shared/services/tnht/tnht.service';
import { MessagingService } from './shared/services/messaging/messaging.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  gettingCommonData: boolean = true
  eventList = <any>[]
  swUpdate = inject(SwUpdate)

  constructor(
    router: Router,
    private kinhService: KinhService,
    private eventService: EventService,
    private meta: Meta,
    private notificationsService: NotificationsService,
    private messagingService: MessagingService,
  ) {

    router.events.subscribe(() => {
      localStorage.setItem(
        'currentLayout',
        JSON.stringify({
          isHideToolbar: false,
          isHideBottomNavBar: false,
        })
      );
    });
    this.addTag()
  }

  ngOnInit(): void {
    this.gettingCommonData = true
    this.kinhService.getKinhList()
      .subscribe((res: any) => {
        if (res) {
          this.kinhService.kinhList = res;
          // fetch(`assets/audios/aud-7-chakra-5-bowl-39233.mp3`)
          this.kinhService.kinhList.forEach((item: any) => {
            this.kinhService.getKinhContent(item.key)
              .subscribe()
          })
          this.eventService.getEventList()
          this.gettingCommonData = false
          // this.tnhtService.getTNHTByPath('quyen-1').subscribe((res: any) => {
          //   if (res.data) {
          //     this.tnhtService.tableContent = res.data
          //     this.tnhtService.tableContent?.content?.forEach((item: any) => {
          //       if (item?.audio && item?.audio?.src) {
          //         fetch(item.audio.src)
          //       }
          //     })
          //     this.checkPushNotification()
          //   }
          // })
          this.checkPushNotification()
        }
      });
    this.messagingService.requestPermission()
    this.messagingService.receiveMessaging()
    this.checkForUpdate()
  }

  checkForUpdate() {
    console.log('checking for updates');
    
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe((evt) => {
        console.log(`current version is ${evt.currentVersion.hash}`);
        console.log(`new version is ${evt.latestVersion.hash}`);
        // Reload the page to update to the latest version.
        document.location.reload();
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
    this.notificationsService.syncPush()
  }
}
