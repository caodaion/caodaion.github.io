import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MENU } from 'src/app/shared/constants/menu.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: false
})
export class GameComponent {
  public drawerMode: any;
  menu = <any>[]

  @ViewChild('drawer') drawer!: ElementRef;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    public viewMissionService: ViewMissionService
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
    this.menu = MENU.find((item: any) => item.key === 'kids')?.children
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened =
        !this.viewMissionService.isDrawerOpened;
    }
  }

}
