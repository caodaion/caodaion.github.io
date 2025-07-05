import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
    standalone: false
})
export class MapsComponent {
  settingsMenu = <any>[
    {
      url: '.',
      icon: 'map',
      label: 'Xem bản đồ',
    }
  ]
  public drawerMode: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public viewMissionService: ViewMissionService
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

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }
}
