import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import { KinhService } from 'src/app/shared/services/kinh/kinh.service';
import {CONSTANT} from "../../../shared/constants/constants.constant";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-kinh-list',
  templateUrl: './kinh-list.component.html',
  styleUrls: ['./kinh-list.component.scss'],
})
export class KinhListComponent implements OnInit {
  nowKinh = new NowKinhModel();
  kinhList = this.kinhService.kinhList;
  commonTimes = this.commonService.commonTimes;
  commonLocationTypes = this.commonService.commonLocationTypes;
  kinhFilter: any[] = [];
  cols: number = 1;
  selectedIndex: number = 0;
  contentEditable: any;
  isLoading: boolean = false;
  eventList = this.eventService.eventList;
  @ViewChild('filterExansionPannel', { static: true, read: MatExpansionPanel })
  filterExansionPannel: MatExpansionPanel | undefined;
  time = this.commonService.time;
  constructor(
    private commonService: CommonService,
    private kinhService: KinhService,
    private eventService: EventService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private route: ActivatedRoute,
    private titleSerVice: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getKinhList();
    this.titleSerVice.setTitle(`Kinh | ${CONSTANT.page.name}`)
    this.route.queryParams.subscribe((params) => {
      if (this.selectedIndex === 0) {
        if (params['me']) {
          this.nowKinh.filter.me = params['me'];
        }
        if (params['e']) {
          this.nowKinh.filter.e = params['e'];
        }
      }
      this.selectedIndex = this.kinhFilter.findIndex(({key}) => key === this.nowKinh.filter.me)
    });
    this.contentEditable = this.authService.contentEditable;
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 2;
        } else {
          this.cols = 6;
        }
      });
  }

  getKinhList() {
    let kinhCungTuThoiKeys = this.eventList
      .find((item: any) => item.key === 'cung-tu-thoi')
      ?.event.find((item: any) => item.key === 'cung-tu-thoi')?.kinh;
    let kinhQuanHonTangTe = this.kinhList.filter(
      (item: any) => !kinhCungTuThoiKeys.includes(item.key)
    );
    kinhQuanHonTangTe = kinhQuanHonTangTe.map((item) => item.key)

    this.kinhFilter.push(
      {
        key: 'cung-tu-thoi',
        name: 'CÚNG TỨ THỜI',
        kinh: this.getKinhListByKey(kinhCungTuThoiKeys),
      },
      {
        key: 'quan-hon-tang-te',
        name: 'QUAN-HÔN, TANG-TẾ',
        kinh: this.getKinhListByKey(kinhQuanHonTangTe),
      }
    );
    this.getNowKinh();
    if (!this.nowKinh.filter.me && !this.nowKinh.filter.e) {
      this.getDefaultNowKinh();
    }
  }

  getNowKinh(nowKinh?: any) {
    this.nowKinh.time = this.commonService.getCommonTimeValue(
      this.nowKinh.time
    );
    this.nowKinh.locationType = this.commonService.getCommonLocationTypeValue(
      this.nowKinh.locationType
    );
    let eventList: any = [];
    this.eventList.forEach((item: any) => {
      item.event.forEach((event: any) => {
        eventList.push({ mainEventKey: item.key, event: event });
      });
    });
    let filter = {
      time: this.nowKinh.time,
      date: this.nowKinh.date,
      locationType: this.nowKinh.locationType,
    };
    this.nowKinh.eventList = eventList?.filter((item: any) => {
      return (
        item.event.time?.filter((time: any) => filter.time.includes(time))
          .length > 0 &&
        item.event.locationType.filter((locationType: any) =>
          filter.locationType.includes(locationType)
        ).length > 0
      );
    });
    const getEventKistList = (now: any) => {
      if (this.filterExansionPannel) {
        this.nowKinh.filterRequired = false;
        this.filterExansionPannel.expanded = false;
        this.nowKinh.selectedEvent = now.event;
        this.nowKinh.filterdMessage = `Đã lọc kinh ${
          this.nowKinh.selectedEvent?.name
        } diễn ra lúc ${
          this.commonTimes
            .find(
              (item: any) => item.key === this.nowKinh.selectedEvent?.time[0]
            )
            ?.name.split('|')[1]
        }`;
      }
    };

    if (nowKinh) {
      if (nowKinh.event.kinh) {
        this.nowKinh.key = nowKinh.event.key;
        this.nowKinh.kinh = nowKinh.event.kinh;
        this.nowKinh.kinhList = this.getKinhListByKey(nowKinh.event.kinh);
        if (this.nowKinh.kinhList.length > 0) {
          if (this.filterExansionPannel) {
            getEventKistList({
              mainEventKey: nowKinh.mainEventKey,
              event: nowKinh.event,
            });
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { me: nowKinh.mainEventKey, e: nowKinh.event.key },
              queryParamsHandling: 'merge',
            });
          }
        }
      }
    } else {
      this.nowKinh.kinhList = this.getKinhListByKey(
        this.nowKinh.eventList.find(
          (item: any) =>
            item.mainEventKey === this.nowKinh.filter.me &&
            item.event.key === this.nowKinh.filter.e
        )?.event?.kinh
      );
      this.nowKinh.selectedEvent = this.nowKinh.eventList.find(
        (item: any) =>
          item.mainEventKey === this.nowKinh.filter.me &&
          item.event.key === this.nowKinh.filter.e
      )?.event;
      getEventKistList({
        mainEventKey: this.nowKinh.filter.me,
        event: this.nowKinh.selectedEvent,
      });
    }
    if (this.nowKinh.eventList.length === 1) {
      this.nowKinh.kinhList = this.getKinhListByKey(
        this.nowKinh.eventList[0].event.kinh
      );
      if (this.nowKinh.kinhList.length > 0) {
        if (this.filterExansionPannel) {
          getEventKistList({
            mainEventKey: this.nowKinh.eventList[0].mainEventKey,
            event: this.nowKinh.eventList[0].event,
          });
        }
      }
    }

    if (
      !this.nowKinh.eventList ||
      !this.nowKinh.kinhList ||
      this.nowKinh.eventList.length === 0 ||
      this.nowKinh.kinhList.length === 0
    ) {
      this.nowKinh.filterRequired = true;
    }
  }

  getDefaultNowKinh() {
    let upcomingKinh = this.nowKinh.eventList
      .filter((item: any) => item.mainEventKey === 'cung-tu-thoi')
      .find(
        (item: any) =>
          item.event.key !== 'cung-tu-thoi' &&
          item.event.time.includes(this.time?.commonTime?.tuThoiUpcoming?.key)
      );
    this.getNowKinh(upcomingKinh);
  }

  getKinhListByKey(keys: any) {
    let kinhList: any[] = [];
    keys?.forEach((item: any) => {
      let currentKinh = this.kinhList.find((kinh: any) => kinh.key === item);
      if (currentKinh) {
        kinhList.push(currentKinh);
      }
    });
    return kinhList;
  }

  selectedTabChange(event: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { me: this.kinhFilter[event.index]?.key, e: this.kinhFilter[event.index]?.key },
      queryParamsHandling: 'merge',
    });
  }

  onOpenKinhContent(kinh: any) {
    this.router.navigate([kinh.key], {
      relativeTo: this.route,
      queryParams: { me: this.nowKinh.filter.me, e: this.nowKinh.filter.e },
    });
  }
}

export class NowKinhModel {
  filterRequired: boolean = false;
  key?: any;
  selectedEvent?: any;
  filter?: any = {
    me: '',
    e: '',
  };
  filterdMessage?: any;
  name?: any;
  kinh?: any;
  prev?: any;
  next?: any;
  eventList?: any;
  kinhList?: any;
  date?: any = ['all'];
  time?: any = ['all'];
  locationType?: any = ['all'];
}
