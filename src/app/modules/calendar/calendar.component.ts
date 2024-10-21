import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import { CONSTANT } from "../../shared/constants/constants.constant";
import { Title } from "@angular/platform-browser";
import { MENU } from 'src/app/shared/constants/menu.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public drawerMode: any;
  @ViewChild('drawer') drawer!: ElementRef;
  @ViewChild('addNewModal') addNewModal!: any;
  menu = <any>[]
  addNewModalRef: any;
  user: any = <any>{}

  constructor(
    private breakpointObserver: BreakpointObserver,
    public calendarService: CalendarService,
    public viewMissionService: ViewMissionService,
    private router: Router,
    private titleSerVice: Title,
    public authService: AuthService,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) { }

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

    this.authService.getCurrentUser().subscribe((res: any) => {
      this.user = res;
      this.menu?.forEach((menu: any) => {
        if (menu?.label === '<self_improvement>') {
          const foundTitleIndex = CAODAI_TITLE.data?.findIndex((ct: any) => ct?.key === this.user?.title)
          if (foundTitleIndex < 3) {
            menu.label = 'Cúng tứ thời'
            menu.icon = 'candle'
            menu.consecutive = this.user?.consecutive
          } else {
            menu.label = 'Công phu'
          }
        }
      })
      if (location.pathname.split('/').length > 2) {
        this.calendarService.calendarViewMode = ''
      }
    })
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
    let modeLink = ''
    let splitedLink = location?.pathname?.split('/')        
    if (splitedLink?.includes('tinh-tuan-cuu')) {
      modeLink = `lich/${mode}`
    } else {
      splitedLink[2] = mode
      modeLink = splitedLink.join('/')
    }    
    this.router.navigate([modeLink]);
  }

  addNew() {
    this.addNewModalRef = this.matDialog.open(this.addNewModal)
  }
}
