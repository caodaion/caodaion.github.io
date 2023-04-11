import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import { KinhService } from 'src/app/shared/services/kinh/kinh.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  event: any;
  eventKey: any;
  eventList = <any>[];
  kinhList = <any>[];
  currentKinhList = <any>[]
  cols: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private kinhService: KinhService,
    private commonService: CommonService,
    private breakpointObserver: BreakpointObserver
  ) {

  }

  ngOnInit(): void {
    this.getEvents()
    this.route.params.subscribe((query) => {
      if (query['eventKey']) {
        this.eventKey = query['eventKey']
      }
    })
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

  getEvents() {
    this.eventList = this.eventService.eventList
    this.getKinhs()
  }

  getKinhs() {
    this.kinhService.getKinhList().subscribe((res: any) => {
      if (res) {
        this.kinhList = res.data
        this.getEventDetails()
      }
    })
  }

  getEventDetails() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.event || [], key));
      return result;
    }
    this.event = find(this.eventList, this.eventKey)
    if (this.event.time) {
      this.event.time = this.commonService.commonTimes.find((time: any) => time.key === this.event.time[0])?.name
    }
    this.event.kinh.forEach((item: any) => {
      let currentKinh = this.kinhList.find((kinh: any) => kinh.key === item);
      if (currentKinh) {
        this.currentKinhList.push(currentKinh);
      }
    })
  }
}
