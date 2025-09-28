import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, inject, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventSignService } from 'src/app/shared/services/event-sign.service';
import { AppTour } from 'src/app/shared/services/app-tour';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.styles.scss'],
  providers: [ThemeService],
})
export class NavigationComponent implements OnInit, OnDestroy, AfterViewInit {

  private readonly appTourService = inject(AppTour);
  private subscriptions: Subscription[] = [];

  isSubNavOpen = false;
  isDarkMode = false;
  lastVisitedPage: string | null = '/';
  showToolbar = true;
  showBottomNav = true;
  eventSigns: any[] = [];
  hasSubmenu = false; // Track if current route has submenu
  navigationTourSteps = [];

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private navigationService: NavigationService,
    private matDialog: MatDialog,
    private eventSignService: EventSignService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscriptions.push(
      this.themeService.darkMode$.subscribe((isDark: any) => {
        Promise.resolve().then(() => {
          this.isDarkMode = isDark;
          this.cdr.detectChanges();
        });
      })
    );

    this.subscriptions.push(
      this.navigationService.showToolbar$.subscribe((show: any) => {
        Promise.resolve().then(() => {
          this.showToolbar = show;
          this.cdr.detectChanges();
        });
      })
    );

    this.subscriptions.push(
      this.navigationService.showBottomNav$.subscribe((show: any) => {
        Promise.resolve().then(() => {
          this.showBottomNav = show;
          this.cdr.detectChanges();
        });
      })
    );
  }

  ngOnInit() {
    this.eventSigns = this.eventSignService.getEventSigns();

    // Initialize submenu visibility based on current route
    this.updateSubmenuVisibility(this.router.url);

    // Subscribe to router events to track navigation
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.appTourService.startTour();
          Promise.resolve().then(() => {
            this.isSubNavOpen = false;

            // Check if current route has submenu functionality
            this.updateSubmenuVisibility(event.urlAfterRedirects);

            if (
              ['/lich', '/hoc', '/apps', '/kinh', '/tnht'].some((path) =>
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
            if (this.router.url.includes('/lich') || this.router.url.includes('/hoc')) {
              this.isSubNavOpen = true;
            }

            this.cdr.detectChanges();
          });
        })
    );
  }

  ngAfterViewInit(): void {
    this.appTourService.startTour();
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleSubNav(): void {
    if (this.router.url.includes('/lich')) {
      this.navigationService.setCalendarNavVisibility(!this.isSubNavOpen);
    }
    if (this.router.url.includes('/hoc')) {
      this.navigationService.setLearnNavVisibility(!this.isSubNavOpen);
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
    const routesWithSubmenu = ['/lich', '/hoc', '/ca-nhan'];
    const newHasSubmenu = routesWithSubmenu.some(route => url.includes(route));

    // Only update if value has changed to avoid unnecessary change detection
    if (this.hasSubmenu !== newHasSubmenu) {
      this.hasSubmenu = newHasSubmenu;
    }
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
