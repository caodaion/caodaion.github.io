import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent {
  settingsMenu = <any>[
    {
      url: 'quet-ma',
      icon: 'qr_code_scanner',
      label: 'Quét mã QR',
    },
    {
      url: 'tao-ma',
      icon: 'qr_code_2_add',
      label: 'Tạo mã QR',
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
