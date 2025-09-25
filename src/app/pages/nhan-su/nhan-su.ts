import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NhanSuForm } from "./components/nhan-su-form/nhan-su-form";
import { ViewMissionService } from 'src/app/shared/services/view-mission/view-mission.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-nhan-su',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    NhanSuForm
  ],
  templateUrl: './nhan-su.html',
  styleUrl: './nhan-su.scss'
})
export class NhanSu implements OnInit {
  inputedPassword: string = '';
  isValidatePassword: boolean = true;
  selectedTab: '4-hang-chuc-sac' | 'chuc-viec-cac-ban-phong' = '4-hang-chuc-sac';
  public drawerMode: any;
  datePipe = inject(DatePipe);

  constructor(
    private breakpointObserver: BreakpointObserver,
    public viewMissionService: ViewMissionService,
    private navigationService: NavigationService
  ) {
    // Set up responsive drawer behavior
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

  ngOnInit(): void {
    // Connect drawer toggle with navigation service
    this.navigationService.toggleDrawer = () => this.onToggleDrawer();
  }

  onPasswordChange(): void {
    this.isValidatePassword = false;
    if (this.inputedPassword && this.datePipe.transform(new Date(), 'ddMMyyyyhhmm') === this.inputedPassword) {
      this.isValidatePassword = true;
      this.fetchNhanSu();
    }
  }

  fetchNhanSu() {
    console.log('fetchNhanSu');
  }

  selectTab(tab: '4-hang-chuc-sac' | 'chuc-viec-cac-ban-phong') {
    this.selectedTab = tab;
  }

  onToggleDrawer() {
    if (this.drawerMode === 'over') {
      this.viewMissionService.isDrawerOpened = !this.viewMissionService.isDrawerOpened;
    }
  }
}
