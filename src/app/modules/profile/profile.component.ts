import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import { AuthService } from "../../shared/services/auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit {
  profileMenu = <any>[

  ]
  public drawerMode: any;
  currentUser: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public viewMissionService: ViewMissionService,
    private authService: AuthService
  ) {
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
  }

  ngAfterViewInit(): void {
    this.currentUser = this.authService.currentUser
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
}
