import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { LichService } from '../lich/services/lich.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SeoService } from 'src/app/shared/services/seo.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-ca-nhan',
  imports: [RouterModule],
  templateUrl: './ca-nhan.html',
  styleUrl: './ca-nhan.scss'
})
export class CaNhan implements OnInit {

  // Track mobile view state
  isMobileView: boolean = false;
  isDrawerOpen: boolean = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private navigationService: NavigationService,
    private seoService: SeoService,
    private lichService: LichService
  ) {

  }
  
  ngOnInit(): void {
    this.setSeoMetadata();
  }

  /**
   * Set SEO metadata for the calendar page
   */
  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: 'Cá Nhân',
      description: 'Cá nhân hóa hành trình mỗi ngày của bạn - CaoDaiON',
      url: 'ca-nhan',
      keywords: 'Cá Nhân, thông tin cá nhân, quản lý cá nhân, Cao Đài, Theo dõi hành trình'
    });
  }
}
