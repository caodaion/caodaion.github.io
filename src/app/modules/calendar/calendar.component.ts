import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import {CONSTANT} from "../../shared/constants/constants.constant";
import {Title} from "@angular/platform-browser";
import { MENU } from 'src/app/shared/constants/menu.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public drawerMode: any;
  @ViewChild('drawer') drawer!: ElementRef;
  menu = <any>[]

  constructor(
    private breakpointObserver: BreakpointObserver,
    public calendarService: CalendarService,
    public viewMissionService: ViewMissionService,
    private router: Router,
    private titleSerVice: Title,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.viewMissionService.isDrawerOpened = false;
          this.drawerMode = 'over';
        } else {
          this.viewMissionService.isDrawerOpened = true;
          this.drawerMode = 'side';
        }
      });
    this.titleSerVice.setTitle(`Lịch | ${CONSTANT.page.name}`)
    this.menu = this.authService.getMenu(MENU.find((item: any) => item.key === 'lich')?.children)
    if (location.pathname.split('/').length > 2) {
      this.calendarService.calendarViewMode = ''
    }

  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
  onChangeCalendarViewMode(mode: any) {
    this.onToggleDrawer()
    this.calendarService.calendarViewMode = mode;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { m: mode },
      queryParamsHandling: 'merge',
    });
  }
}
