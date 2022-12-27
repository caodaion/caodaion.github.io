import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import {CommonService} from "../../../shared/services/common/common.service";
import {CONSTANT} from "../../../shared/constants/constants.constant";
import { Title } from '@angular/platform-browser';

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
    private commonService: CommonService
  ) {}

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
    this.eventService.getEventList().subscribe((res: any) => {
      if (res) {
        this.eventList = res.data
        this.getHappeningTuThoiEvents()
        this.getTodayTuThoiEvents()
      }
    })
  }

  getHappeningTuThoiEvents () {
    this.happeningEvents.event = []
    switch (this.time?.commonTime?.current?.key) {
      case 'ty-2301':
      case 'meo-0507':
      case 'ngo-1113':
      case 'dau-1719':
        this.happeningEvents.event = [this.eventList.find((item: any) => {
          return item.key === 'cung-tu-thoi'
        })?.event?.find((item: any) => {
          return item?.time?.length == 1 && item?.time.find((time: any) => time === this.time?.commonTime?.current?.key)
        })]
        if (this.happeningEvents.event[0]) {
          this.happeningEvents.event[0].startTime = `${this.happeningEvents.event[0]?.time[0].split('-')[1]?.slice(0,2)}:00`
          this.happeningEvents.event[0].endTime = `${this.happeningEvents.event[0]?.time[0].split('-')[1]?.slice(2,4)}:00`
        }
        break;
      default:
        break;
    }
  }

  getTodayTuThoiEvents () {
    this.todayEvents.event = []
    this.todayEvents.event = this.eventList.find((item: any) => {
      return item.key === 'cung-tu-thoi'
    })?.event?.filter((item: any) => item.key !== 'cung-tu-thoi')
    this.todayEvents.event.forEach((item: any) => {
      item.location = item?.locationType[0] === 'all' ? 'Điện thờ Đức Chí Tôn' : ''
      if (item?.time) {
        item.startTime = `${item?.time[0].split('-')[1]?.slice(0,2)}:00`
        item.endTime = `${item?.time[0].split('-')[1]?.slice(2,4)}:00`
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
    // this.todayEvents.event = this.todayEvents?.event?.filter((item: any) => {
    //   return new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${item.endTime}:00`) > new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`)
    // })
    this.todayEvents.event = this.todayEvents?.event?.filter((item: any) => {
      return new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${item.endTime}:00`) > new Date()
    })
  }

  viewEvent(event?: any, index?: any) {
    if (!this.todayEvents.showFullList && ((!event && !index) || (event && index !== 0))) {
      this.todayEvents.showFullList = !this.todayEvents.showFullList
    } else {
      this.router.navigate([event.key], {
        relativeTo: this.route
      })
    }
  }
}

export class EventModel {
  key: any;
  name: any;
  description?: any;
  event?: any;
}
