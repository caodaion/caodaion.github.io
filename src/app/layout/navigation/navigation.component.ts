import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventSignService } from 'src/app/shared/services/event-sign.service';

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
    this.eventSigns = this.eventSignService.getEventSigns();
    // Subscribe to router events to track navigation
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isSubNavOpen = false;
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
