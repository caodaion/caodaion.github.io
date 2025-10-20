import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { ActivatedRoute, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { map, shareReplay, Subscription } from 'rxjs';
import { IconComponent } from "src/app/components/icon/icon.component";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { Blogger } from 'src/app/shared/services/blogger';
import { LearnDataService } from './services/learn-data.service';
import { LearnActionContribute } from "./components/learn-action-contribute/learn-action-contribute";
import { TourMatMenuModule } from "ngx-ui-tour-md-menu";

@Component({
  selector: 'app-learn',
  imports: [
    MatSidenavModule,
    IconComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LearnActionContribute,
    TourMatMenuModule
],
  templateUrl: './learn.html',
  styleUrl: './learn.scss'
})
export class Learn {
  // Reference to the drawer element
  @ViewChild('drawer') drawer!: MatDrawer;
  hocPosts: any[] = [];
  // Track drawer state
  isDrawerOpen: boolean = true;
  // Track mobile view state
  isMobileView: boolean = false;
  currentTitle: string = 'Học';

  private subscriptions: Subscription[] = [];

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private seoService: SeoService,
    private learnDataService: LearnDataService
  ) { }

  bloggerService = inject(Blogger);
  allSessionGroups: any[] = [];

  ngOnInit(): void {
    this.fetchHocPosts();
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
        this.isDrawerOpen = show;
      })
    );
  }

  /**
   * Set SEO metadata for the calendar page
   */
  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: 'Học',
      description: 'Học về đạo Cao Đài qua các bài học tương tác',
      url: 'hoc',
      keywords: 'Học, đạo Cao Đài, bài học, giáo lý, tín đồ Cao Đài, tôn giáo, triết lý, tâm linh, CaoDaiON',
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

  fetchHocPosts() {
    this.bloggerService.fetchHocPosts().subscribe((posts: any) => {
      this.hocPosts = posts?.items || [];
      // Share the data with child components via service
      this.learnDataService.setHocPosts(this.hocPosts);
    });
  }
}
