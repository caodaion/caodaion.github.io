import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  RouterModule,
  Router,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CalendarFilterComponent } from './components/calendar-filter/calendar-filter.component';
import { CalendarControllerComponent } from './components/calendar-controller/calendar-controller.component';
import { map, Subscription, shareReplay, filter } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { LichService } from './services/lich.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IconComponent } from '../../components/icon/icon.component';
import { SeoService } from '../../shared/services/seo.service';
import { TourAnchorMatMenuDirective, TourMatMenuModule } from "ngx-ui-tour-md-menu";

@Component({
  selector: 'app-lich',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CalendarFilterComponent,
    CalendarControllerComponent,
    IconComponent,
    TourAnchorMatMenuDirective,
    TourMatMenuModule
],
  templateUrl: './lich.component.html',
  styleUrls: ['./lich.component.scss'],
})
export class LichComponent implements OnInit, AfterViewInit, OnDestroy {
  // Track the Can Chi visibility state
  showCanChi: boolean = false;

  // Reference to the drawer element
  @ViewChild('drawer') drawer!: MatDrawer;

  // Track drawer state
  isDrawerOpen: boolean = true;

  // Track mobile view state
  isMobileView: boolean = false;

  private subscriptions: Subscription[] = [];

  // Inject platform ID for browser environment checks
  private platformId = inject(PLATFORM_ID);

  // Calendar properties
  currentDate: Date = new Date();
  currentView: string = 'month';

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private lichService: LichService,
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
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          // Determine initial view from URL
          const url = this.router.url;
          if (url.includes('/lich/w/')) {
            this.currentView = 'week';
            this.updateSeoForView('week');
          } else if (url.includes('/lich/d/')) {
            this.currentView = 'day';
            this.updateSeoForView('day');
          } else {
            this.currentView = 'month';
            this.updateSeoForView('month');
          }
        })
    );

    // Initialize Can Chi visibility from localStorage if available
    const savedCanChiSetting = localStorage.getItem('showCanChi');
    if (savedCanChiSetting) {
      const showCanChi = JSON.parse(savedCanChiSetting);
      // Dispatch the stored setting on component init to ensure consistency
      this.onCanChiVisibilityChange(showCanChi);
    }

    // If we're at exactly /lich, redirect to the month view with current date
    if (this.router.url === '/lich') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // JavaScript months are 0-based
      this.router.navigate(['/lich/m', year, month]);
    }

    this.subscriptions.push(
      this.navigationService.showCalendarNav$.subscribe((show: any) => {
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

  /**
   * Update SEO metadata based on the current calendar view
   */
  private updateSeoForView(view: string): void {
    let title: string;
    let description: string;
    let url: string;
    
    // Format date for SEO content
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();
    const formattedDate = this.lichService.formatDateRange(this.currentDate, view as any);

    switch(view) {
      case 'month':
        title = `Lịch tháng ${month}/${year}`;
        description = `Xem lịch tháng ${month} năm ${year} - Lịch âm dương, các sự kiện và ngày lễ - CaoDaiON`;
        url = `lich/m/${year}/${month}`;
        break;
      case 'week':
        title = `Lịch tuần - ${formattedDate}`;
        description = `Xem lịch tuần từ ${formattedDate} - Lịch âm dương, các sự kiện và ngày lễ - CaoDaiON`;
        url = `lich/w/${year}/${month}/${day}`;
        break;
      case 'day':
        title = `Lịch ngày ${day}/${month}/${year}`;
        description = `Xem lịch ngày ${day} tháng ${month} năm ${year} - Lịch âm dương, các sự kiện và ngày lễ - CaoDaiON`;
        url = `lich/d/${year}/${month}/${day}`;
        break;
      default:
        title = 'Lịch';
        description = 'Lịch âm dương, lịch vạn niên, các sự kiện và ngày lễ quan trọng - CaoDaiON';
        url = 'lich';
    }

    this.seoService.updateMetadata({
      title,
      description,
      url,
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

  onCanChiVisibilityChange(isVisible: boolean): void {
    console.log('LichComponent received Can Chi visibility change:', isVisible);
    this.showCanChi = isVisible;
    localStorage.setItem('showCanChi', JSON.stringify(isVisible));
    this.dispatchCanChiEvent(isVisible);
  }

  /**
   * Dispatch Can Chi visibility event to all child components
   */
  private dispatchCanChiEvent(isVisible: boolean): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('canChiVisibilityChange', {
        detail: isVisible,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    }
  }

  // Calendar controller handlers
  onDateChange(date: Date): void {
    this.currentDate = date;

    // Update the route based on current view
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (this.currentView === 'month') {
      this.router.navigate(['/lich/m', year, month]);
    } else if (this.currentView === 'week') {
      this.router.navigate(['/lich/w', year, month, day]);
    } else if (this.currentView === 'day') {
      this.router.navigate(['/lich/d', year, month, day]);
    }
    
    // Update SEO metadata for the new date
    this.updateSeoForView(this.currentView);
  }

  onViewChange(view: string): void {
    this.currentView = view;

    // Handle view change
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();

    if (view === 'month') {
      this.router.navigate(['/lich/m', year, month]);
    } else if (view === 'week') {
      this.router.navigate(['/lich/w', year, month, day]);
    } else if (view === 'day') {
      this.router.navigate(['/lich/d', year, month, day]);
    }
    
    // Update SEO metadata for the new view
    this.updateSeoForView(view);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
