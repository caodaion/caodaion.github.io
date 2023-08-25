import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import { MENU } from "../../shared/constants/menu.constant";
import { AuthService } from "../../shared/services/auth/auth.service";
import { CONSTANT } from "../../shared/constants/constants.constant";
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  public drawerMode: any;
  menu = <any>[]
  @ViewChild('drawer') drawer!: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private titleSerVice: Title,
    public viewMissionService: ViewMissionService,
    private router: Router
  ) {
  }

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
    this.menu = this.authService.getMenu(MENU.find((item: any) => item.key === 'tac-vu')?.children, this.authService.currentUser?.children?.find((item: any) => item.key === 'tac-vu'))
    this.titleSerVice.setTitle(`Tác vụ | ${CONSTANT.page.name}`)
    if (this.menu?.length > 0 && location.pathname === '/tac-vu') {
      this.router.navigate([`tac-vu/${this.menu[0].url}`])
    }
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
}
