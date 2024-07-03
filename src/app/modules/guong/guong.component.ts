import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';

@Component({
  selector: 'app-guong',
  templateUrl: './guong.component.html',
  styleUrls: ['./guong.component.scss']
})
export class GuongComponent {
  profileMenu = <any>[

  ]
  public drawerMode: any;
  currentUser: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public viewMissionService: ViewMissionService,
    private authService: AuthService,
    private route: ActivatedRoute
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

  ngAfterViewInit(): void {+
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.currentUser = res
        this.profileMenu = [
          {
            key: 'profile.guong',
            url: 'guong',
            label: 'Gương',
            icon: 'bubble_chart',
            fullAssess: true,
            released: true,
          },
        ]
      },
    })
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
}
