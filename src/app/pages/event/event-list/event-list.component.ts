import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import { CommonService } from "../../../shared/services/common/common.service";
import { CONSTANT } from "../../../shared/constants/constants.constant";
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  selectedIndex: number = 0;
  contentEditable: any;
  isLoading: boolean = false;
  cols: number = 1;
  eventList = <any>[];
  happeningEvents = {
    event: <any>[],
    showFullList: false
  }
  upcomingEvents = {
    event: <any>[],
    showFullList: false
  }
  todayEvents = {
    event: <any>[],
    showFullList: false
  }
  time = this.commonService.time;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private eventService: EventService,
    private titleSerVice: Title,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getEvents()
    this.route.queryParams.subscribe((params) => {
      if (params['t']) {
        this.selectedIndex = parseInt(params['t']);
      } else {
        if (this.authService.contentEditable) {
          this.selectedIndex = 3;
        } else {
          this.selectedIndex = 0;
        }
      }
    });
    this.titleSerVice.setTitle(`Sự kiện | ${CONSTANT.page.name}`)
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 2;
        } else {
          this.cols = 6;
        }
      });
    this.contentEditable = this.authService.contentEditable;
  }

  selectedTabChange(event: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { t: event.index },
      queryParamsHandling: 'merge',
    });
  }

  getEvents() {
    this.eventList = this.eventService.eventList
    this.getTodayTuThoiEvents()
    this.getLocalStorageEvents()
  }

  getLocalStorageEvents() {
    const currentDate = new Date()
    const tuanCuuEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    tuanCuuEvents.forEach((tuanCuu: any) => {
      const foundEvent = tuanCuu.event.find((e: any) => {
        return new Date(e?.solar).getDate() == currentDate.getDate() &&
          new Date(e?.solar).getMonth() == currentDate.getMonth() &&
          new Date(e?.solar).getFullYear() == currentDate.getFullYear()
      })
      if (foundEvent) {
        const title = CAODAI_TITLE.data.find((ct: any) => ct.key === tuanCuu.details.title)
        const data = <any>{
          eventName: `${title?.eventTitle} ${foundEvent.eventName} cho ${title?.howToAddress ? (tuanCuu.details.sex === 'male' ? title?.howToAddress.male : tuanCuu.details.sex === 'female' ? title?.howToAddress.female : '') : ''} ${title?.name} ${tuanCuu.details?.holyName || tuanCuu.details?.name} ${tuanCuu.details?.age ? tuanCuu.details?.age + ' tuổi.' : '.'}`
        }
        data.backgroundColor = `#fbbc05`
        this.todayEvents.event.push(data)
      }
    })
  }

  getHappeningTuThoiEvents() {
    this.happeningEvents.event = []
    this.happeningEvents.event = this.upcomingEvents?.event?.filter((item: any) => {
      const currentTime = new Date()
      return currentTime >= item?.startTime && currentTime <= item?.endTime
    })
  }

  getTodayTuThoiEvents() {
    let pushNotification = JSON.parse(localStorage.getItem('pushedNotification') || '[]')
    if (!pushNotification) {
      pushNotification = []
    }
    this.upcomingEvents.event = []
    this.upcomingEvents.event = this.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    this.upcomingEvents.event.forEach((item: any) => {
      item.location = item?.locationType[0] === 'all' ? 'Điện thờ Đức Chí Tôn' : ''
      if (item?.time) {
        const nowTime = new Date()
        item.startTime = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(0, 2)}:00:00`)
        item.endTime = new Date(`${this.datePipe.transform(nowTime, 'yyyy-MM-dd')} ${item?.time[0].split('-')[1]?.slice(2, 4)}:00:00`)
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate())
        currentDate.setHours(parseInt(item?.time[0].split('-')[1]?.slice(0, 2)))
        currentDate.setMinutes(0)
        currentDate.setSeconds(0)
        currentDate.setMinutes(currentDate.getMinutes() - 10)
        item.isActiveNotification = !!pushNotification?.find((p: any) => p.key == `${item?.key}.${this.datePipe.transform(currentDate, 'yyyyMMddHHmmss')?.toString()}`)
        switch (item?.time[0]) {
          case 'ty-2301':
            item.color = `#ffffff`
            item.backgroundColor = `linear-gradient(#221f23, #19386d)`
            break;
          case 'meo-0507':
            item.backgroundColor = `linear-gradient(#f1a2c4, #f9f2ec)`
            break;
          case 'ngo-1113':
            item.backgroundColor = `linear-gradient(#daf4d7, #07b4ff)`
            break;
          case 'dau-1719':
            item.color = `#ffffff`
            item.backgroundColor = `linear-gradient(#b87059, #7a019e)`
            break;
          default:
            item.backgroundColor = 'black'
            item.color = 'white'
            break;
        }
      }
    })
    // console.log(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 07:00:00`))
    // this.upcomingEvents.event = this.upcomingEvents?.event?.filter((item: any) => {
    //   return new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${item.endTime}:00`) > new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`)
    // })
    this.upcomingEvents.event = this.upcomingEvents?.event?.filter((item: any) => {
      return item.endTime > new Date()
    })
    if (this.upcomingEvents?.event?.length < 2) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key ? o : find(o.event || [], key));
        return result;
      }
      const nextEvent = find(this.eventList, 'cung-thoi-ty')
      if (nextEvent) {
        nextEvent.color = `#ffffff`
        nextEvent.backgroundColor = `linear-gradient(#221f23, #19386d)`
        nextEvent.endTime.setDate(nextEvent.endTime.getDate() + 1)
        this.upcomingEvents?.event.push(find(this.eventList, 'cung-thoi-ty'))
      }
    }
    this.getHappeningTuThoiEvents()
  }

  viewEvent(event?: any, index?: any) {
    if (event?.key) {
      if (!this.upcomingEvents.showFullList && ((!event && !index) || (event && index !== 0))) {
        this.upcomingEvents.showFullList = !this.upcomingEvents.showFullList
      } else {
        this.router.navigate([event?.key], {
          relativeTo: this.route
        })
      }
    }
  }

  clickEvent(event?: any, index?: any) {
    if (event?.key) {
      if (!this.upcomingEvents.showFullList && ((!event && !index) || (event && index !== 0))) {
        this.upcomingEvents.showFullList = !this.upcomingEvents.showFullList
      }
    }
  }

  toggleNotificationSubscription(item: any, index: any) {
    item.isActiveNotification = !item.isActiveNotification
    const pushNotification = <any>[]
    Array.from({ length: 3 }, (x, i) => {
      let time = item.startTime
      let payload = {
        body: `Đã đến ${this.datePipe.transform(time, 'HH:mm')}, là giờ ${item?.name}`,
        data: {
          url: `${location.href}/${item?.key}`
        },
        icon: "assets/icons/windows11/Square150x150Logo.scale-400.png",
        image: "assets/icons/windows11/Wide310x150Logo.scale-400.png"
      }
      if (i > 1) {
        payload.body = `Hãy chuẩn bị ${item?.name} vào lúc ${this.datePipe.transform(item.startTime, 'HH:mm')}`
        time.setMinutes(time.getMinutes() - (this.notificationsService.pushNotificationsSettings?.tuThoi?.duration || 10))
      }
      if (i == 0) {
        payload.body = `Đã đặt thông báo trước ${item?.name} ${this.notificationsService.pushNotificationsSettings?.tuThoi?.duration || 10} phút.`
        time = new Date()
      }
      pushNotification.push({
        key: `${item.key}.${this.datePipe.transform(time, 'yyyyMMddHHmmss')}`,
        title: `Thông báo ${item?.name}`,
        isforcePush: i == 0,
        payload: payload,
        notificationAt: this.datePipe.transform(time, 'yyyy-MM-dd HH:mm:ss'),
      })
    })
    this.notificationsService.addNewPush(pushNotification)
  }
}

export class EventModel {
  key: any;
  name: any;
  description?: any;
  event?: any;
}
