import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, Subscription } from 'rxjs';
import { IconComponent } from "src/app/components/icon/icon.component";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { Lessons } from "./components/lessons/lessons";
import { Blogger } from 'src/app/shared/services/blogger';
import { Lesson } from "./components/lesson/lesson";
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";

@Component({
  selector: 'app-learn',
  imports: [
    MatSidenavModule,
    IconComponent,
    Lessons,
    Lesson,
    ChildHeaderComponent
],
  templateUrl: './learn.html',
  styleUrl: './learn.scss'
})
export class Learn {
  // Reference to the drawer element
  @ViewChild('drawer') drawer!: MatDrawer;
  displayedView: string = 'lessons';
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
    private seoService: SeoService
  ) { }

  bloggerService = inject(Blogger);
  allSessionGroups: any[] = [];
  lessonPost: any = null;

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

  fetchHocPosts() {
    this.bloggerService.fetchHocPosts().subscribe((posts: any) => {
      console.log(posts);

      this.hocPosts = posts?.items || [];
    });
  }

  openLesson(lesson: any): void {
    this.lessonPost = lesson;
    this.displayedView = 'lesson';
  }

  onGoBack() {
    if (this.displayedView === 'lesson') {
      this.displayedView = 'lessons';
      return;
    }
  }
}
