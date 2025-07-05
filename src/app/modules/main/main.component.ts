import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import {MENU} from "../../shared/constants/menu.constant";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: false
})
export class MainComponent implements OnInit {
  public drawerMode: any;
  menu = <any>[]

  @ViewChild('drawer') drawer!: ElementRef;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    public viewMissionService: ViewMissionService
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
    this.menu = this.authService.getMenu(MENU.find((item: any) => item.key === 'trang-chu')?.children)
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
}
