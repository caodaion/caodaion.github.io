import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { map, shareReplay, filter, Subscription } from 'rxjs';
import { IconComponent } from "src/app/components/icon/icon.component";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { LichService } from '../lich/services/lich.service';

@Component({
  selector: 'app-learn',
  imports: [
    MatSidenavModule,
    IconComponent,
    RouterOutlet
  ],
  templateUrl: './learn.html',
  styleUrl: './learn.scss'
})
export class Learn {
  // Reference to the drawer element
  @ViewChild('drawer') drawer!: MatDrawer;

  // Track drawer state
  isDrawerOpen: boolean = true;

  // Track mobile view state
  isMobileView: boolean = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.setSeoMetadata();

    // Monitor screen size changes
    this.subscriptions.push(
      this.breakpointObserver
        .observe('(max-width: 768px)')
        .pipe(
          map((result) => result.matches),
          shareReplay()
        )
        .subscribe((isMobile) => {
          this.isMobileView = isMobile;
          this.isDrawerOpen = !isMobile;
          this.navigationService.setCalendarNavVisibility(this.isDrawerOpen);
        })
    );

    this.subscriptions.push(
      this.navigationService.showLearnNav$.subscribe((show: any) => {
        console.log(show);
        this.isDrawerOpen = show;
      })
    );
  }

  /**
   * Set SEO metadata for the calendar page
   */
  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: 'Lịch',
      description: 'Lịch âm dương, lịch vạn niên, các sự kiện và ngày lễ quan trọng - CaoDaiON',
      url: 'lich',
      keywords: 'Lịch, lịch âm, lịch dương, lịch vạn niên, sự kiện, ngày lễ, Cao Đài'
    });
  }

  ngAfterViewInit(): void {
    // Close drawer automatically on mobile
    if (this.isMobileView) {
      this.isDrawerOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView && this.isDrawerOpen) {
      this.isDrawerOpen = false;
    }
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
