import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventSignService } from 'src/app/shared/services/event-sign.service';
import { TourService } from 'ngx-ui-tour-md-menu';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.styles.scss'],
  providers: [ThemeService],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isSubNavOpen = false;
  isDarkMode = false;
  lastVisitedPage: string | null =
    localStorage.getItem('lastVisitedPage') || '/';
  showToolbar = true;
  showBottomNav = true;
  eventSigns: any[] = [];
  tourService = inject(TourService)
  hasSubmenu = false; // Track if current route has submenu

  private subscriptions: Subscription[] = [];

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private navigationService: NavigationService,
    private matDialog: MatDialog,
    private eventSignService: EventSignService
  ) {
    this.subscriptions.push(
      this.themeService.darkMode$.subscribe((isDark: any) => {
        this.isDarkMode = isDark;
      })
    );

    this.subscriptions.push(
      this.navigationService.showToolbar$.subscribe((show: any) => {
        this.showToolbar = show;
      })
    );

    this.subscriptions.push(
      this.navigationService.showBottomNav$.subscribe((show: any) => {
        this.showBottomNav = show;
      })
    );
  }

  ngOnInit() {
    this.tourService.initialize([
      {
        anchorId: 'navigationRail',
        content: 'Sử dụng menu bên trái để điều hướng',
        title: 'Menu điều hướng',
        enableBackdrop: true,
        prevBtnTitle: 'Quay lại',
        nextBtnTitle: 'Tiếp tục',
        endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationToggleSubNav',
        content: 'Nhấn vào đây để mở menu phụ',
        title: 'Mở menu phụ',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationToggleDarkMode',
        content: 'Nhấn vào đây để chuyển đổi chế độ tối',
        title: 'Chuyển đổi chế độ tối',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationHome',
        content: 'Nhấn vào đây để về trang chủ',
        title: 'Về trang chủ',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationLich',
        content: 'Nhấn vào đây để xem lịch',
        title: 'Xem lịch',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationKinh',
        content: 'Nhấn vào đây để xem kinh',
        title: 'Xem kinh',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
      {
        anchorId: 'navigationApps',
        content: 'Nhấn vào đây để xem các ứng dụng',
        title: 'Xem ứng dụng',
        enableBackdrop: true,
         prevBtnTitle: 'Quay lại',
    nextBtnTitle: 'Tiếp tục',
    endBtnTitle: 'Kết thúc'
      },
    ])
    this.tourService.start()
    this.eventSigns = this.eventSignService.getEventSigns();
    
    // Initialize submenu visibility based on current route
    this.updateSubmenuVisibility(this.router.url);
    
    // Subscribe to router events to track navigation
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isSubNavOpen = false;
          
          // Check if current route has submenu functionality
          this.updateSubmenuVisibility(event.urlAfterRedirects);
          
          if (
            ['/lich', '/apps', '/kinh', '/tnht'].some((path) =>
              event.urlAfterRedirects.startsWith(path)
            )
          ) {
            localStorage.setItem(
              'lastVisitedPage',
              `/${event.urlAfterRedirects?.split('/')[1]}`
            );
            this.lastVisitedPage = `/${event.urlAfterRedirects?.split('/')[1]}`;
          } else {
            if (event.urlAfterRedirects === '/') {
              localStorage.setItem('lastVisitedPage', event.urlAfterRedirects);
              this.lastVisitedPage = event.urlAfterRedirects;
            }
          }
          if (this.router.url.includes('/lich')) {
            this.isSubNavOpen = true;
          }
        })
    );
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleSubNav(): void {
    if (this.router.url.includes('/lich')) {
      this.navigationService.setCalendarNavVisibility(!this.isSubNavOpen);
    }
    if (this.router.url.includes('/ca-nhan')) {
      this.navigationService.setCaNhanNavVisibility(!this.isSubNavOpen);
    }
    this.isSubNavOpen = !this.isSubNavOpen;
  }

  /**
   * Check if current route has submenu functionality and update hasSubmenu property
   * @param url Current route URL
   */
  private updateSubmenuVisibility(url: string): void {
    // Define routes that have submenu functionality
    const routesWithSubmenu = ['/lich', '/ca-nhan'];
    this.hasSubmenu = routesWithSubmenu.some(route => url.includes(route));
  }

  closeSubNav(): void {
    this.isSubNavOpen = false;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  goBack(): void {
    this.router.navigate(['..']);
  }

  @ViewChild('qrCodeScannerDialog') qrCodeScannerDialog: any;
  openQRCodeScanner() {
    this.matDialog.open(this.qrCodeScannerDialog, {
      panelClass: 'qrScannerDialog'
    })
  }
}
