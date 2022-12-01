import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
  MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition,
  MatLegacySnackBar as MatSnackBar,
} from '@angular/material/legacy-snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CaodaionEditorService } from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';
import { KinhService } from 'src/app/shared/services/kinh/kinh.service';
import { EventModel } from '../event-list/event-list.component';

@Component({
  selector: 'app-event-content',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {
  eventKey!: String;
  currentEvent = new EventModel();
  contentEditable: boolean = false;
  isLoading: boolean = false;
  isShowBackButton: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  eventList = this.eventService.eventList;
  kinhList = this.kinhService.kinhList;
  commonTimes = this.commonService.commonTimes;
  commonDates = this.commonService.commonDates;
  commonLocationTypes = this.commonService.commonLocationTypes;
  constructor(
    protected route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private location: Location,
    private eventService: EventService,
    private kinhService: KinhService,
    private caodaionEditorService: CaodaionEditorService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.eventKey = params['eventKey'];
    });
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.contentEditable = false;
          this.isShowBackButton = false;
          localStorage.setItem(
            'currentLayout',
            JSON.stringify({
              isHideToolbar: true,
              isHideBottomNavBar: true,
            })
          );
        } else {
          this.contentEditable = this.authService.contentEditable;
          this.isShowBackButton = true;
          localStorage.setItem(
            'currentLayout',
            JSON.stringify({
              isHideToolbar: false,
              isHideBottomNavBar: false,
            })
          );
        }
      });
    this.getEvent();
  }

  getEvent() {
    let currentEvent = this.eventList.find(
      (item: any) => item.key === this.eventKey
    );
    this.currentEvent = currentEvent ? currentEvent : new EventModel();
    if (!this.currentEvent.event || this.currentEvent.event.length === 0) {
      this.currentEvent.event = [];
      const newEvent = new EventTemplateModel();
      this.currentEvent.event.push(newEvent);
    } else {
      this.currentEvent.event.forEach((event: any) => {
        event.selectedDate = event.date.split('-')[2];
        event.month = event.date.split('-')[1];
        event.year = [event.date.split('-')[0]];
        event.kinhList = [];
        event.kinh.forEach((item: any) => {
          let selectedKinh = this.kinhList?.find(
            (kinh: any) => kinh.key === item
          );
          event.kinhList.push(selectedKinh);
        });
      });
    }
  }

  onChangeSelectedKinhOption(type: any, event: any, stock: any, filter: any) {
    event.kinhList = [];
    if (type === 'stock') {
      if (stock.selectedOptions.selected) {
        stock.selectedOptions.selected.forEach((item: any) => {
          let selectedKinh = this.kinhList?.find(
            (kinh: any) => kinh.key === item.value
          );
          event.kinhList.push(selectedKinh);
        });
      }
    }
    if (type === 'filter') {
      if (filter.selectedOptions.selected) {
        filter.selectedOptions.selected.forEach((item: any) => {
          let selectedKinh = this.kinhList?.find(
            (kinh: any) => kinh.key === item.value
          );
          event.kinhList.push(selectedKinh);
        });
      }
    }
    event.kinh = event.kinhList.map((item: any) => item.key);
  }

  onChangeCommonTime(event: any) {
    event.time = this.commonService.getCommonTimeValue(event.time);
  }

  onChangeCommonLocationTypeValue(event: any) {
    event.locationType = this.commonService.getCommonLocationTypeValue(
      event.locationType
    );
  }

  onAddNewEvent(event?: any) {
    const newEvent = new EventTemplateModel();
    if (!event) {
      this.currentEvent.event.push(newEvent);
    } else {
      if (
        !event.name ||
        !event.time ||
        !event.locationType ||
        !event.kinh ||
        event.kinh.length === 0
      ) {
        console.log(event);
      } else {
        this.currentEvent.event.push(newEvent);
      }
    }
  }

  onChangeName() {
    this.currentEvent.key = this.currentEvent.name
      ? this.getSlug(this.currentEvent.name)
      : '';
  }

  onChangeEventName(event: any) {
    event.key = event.name ? this.getSlug(event.name) : '';
  }

  getSlug(name: any) {
    return this.caodaionEditorService.generatedSlug(name);
  }

  onSave() {
    let newEventList: any[] = [];
    if (this.eventKey === 'them-moi') {
      this.eventList.push(this.currentEvent);
    }
    this.eventList.forEach((item: any) => {
      let newEvent: EventTemplateModel[] = [];
      newEvent = item.event.map((event: any) => ({
        key: event.key,
        name: event.name,
        dateType: event.dateType,
        date:
          event.year && event.month && event.selectedDate
            ? `${event.year}-${event.month}-${event.selectedDate}`
            : event.date,
        time: event.time,
        locationType: event.locationType,
        kinh: event.kinh,
      }));
      newEventList.push({
        name: item.name,
        description: item.description,
        key: item.key,
        event: newEvent,
      });
    });
    console.log({ data: newEventList });
  }

  onBack() {
    this.location.back();
  }
}

export class EventTemplateModel {
  key: any;
  name: any;
  dateType: any = 'lunar';
  date: any;
  selectedDate: any;
  month: any;
  year: any;
  time: any;
  locationType: any;
  kinh: any;
  kinhList?: any;
}
