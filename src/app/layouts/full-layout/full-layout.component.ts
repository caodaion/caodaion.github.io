import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {
  AfterViewChecked,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {fromEvent, interval, Observable, Subscription} from 'rxjs';
import {CommonService} from 'src/app/shared/services/common/common.service';
import {ViewMissionService} from 'src/app/shared/services/view-mission/view-mission.service';
import {OfflineSnackbarComponent} from '../offline-snackbar/offline-snackbar.component';
import {AuthService} from "../../shared/services/auth/auth.service";
import {MENU} from "../../shared/constants/menu.constant";
import { Router } from '@angular/router';

@Component({
  selector: 'full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: [
    './full-layout.component.scss',
  './styles/caodaionlogo.fulllayout.component.scss',
  './styles/main-drawer.fulllayout.component.scss',
  './styles/main-toolbar.fulllayout.component.scss',
],
})
export class FullLayoutComponent implements OnInit, AfterViewChecked {
  offlineEvent?: Observable<Event>;
  onlineEvent?: Observable<Event>;
  subscriptions: Subscription[] = [];
  isOffline: boolean = false;
  isDrawerOpened: boolean = false;
  currentLayout: any;
  isHideToolbar: boolean = false;
  isHideBottomNavBar: boolean = false;
  time = this.commonService.time;
  viewPortMode: any;
  deferredPrompt: any;
  isShowButtonInstall: boolean = false;
  isStandalone: any;
  unreadCount: any = 1;
  protected readonly publicKey =
    'BOVH41pe57AnjbYpRvEOrJvyo9eGeOkfyCVPvBnvS8KF4IG9Wo6NsEubLzrXbeEz1ihntSxRWh0qOxrdhaWo_I4';

  mainMenu = <any>[]
  currentUser: any

  constructor(
    private _snackBar: MatSnackBar,
    private viewMissionService: ViewMissionService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private appRef: ApplicationRef,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.handleAppConnectivityChanges();
    this.onUpdateVersion();
    this.autoCheckForUpdate();
    this.pushSubscription();
    this.checkMessage()
    this.notificationClicks()
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.viewPortMode = 'mobile';
        } else {
          this.viewPortMode = 'desktop';
        }
      });
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      this.isShowButtonInstall = true;
      // Optionally, send analytics event that PWA install promo was shown.
      console.log(`'beforeinstallprompt' event was fired.`);
    });
    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      this.isShowButtonInstall = false;
      // Clear the deferredPrompt so it can be garbage collected
      this.deferredPrompt = null;
      // Optionally, send analytics event to indicate successful install
      console.log('PWA was installed');
    });
    this.getPWADisplayMode();
    window
      .matchMedia('(display-mode: standalone)')
      .addEventListener('change', (evt) => {
        let displayMode = 'browser';
        if (evt.matches) {
          displayMode = 'standalone';
        }
        // Log display mode change to analytics
        console.log('DISPLAY_MODE_CHANGED', displayMode);
      });
    // Set the badge
    // @ts-ignore
    // navigator?.setAppBadge(this.unreadCount).catch((error) => {
    //   //Do something with the error.
    // });
    this.mainMenu = this.authService.getMenu(MENU)
    this.currentUser = this.authService.getCurrentUser()

  }

  clearUnread() {
    // Clear the badge
    // @ts-ignore
    navigator.clearAppBadge().then(() => (this.unreadCount = 0)).catch((error) => {
      // Do something with the error.
    });
  }

  ngAfterViewChecked(): void {
    this.currentLayout = JSON.parse(<string>localStorage.getItem('currentLayout'))
    this.isHideToolbar = this.currentLayout?.isHideToolbar;
    this.isHideBottomNavBar = this.currentLayout?.isHideBottomNavBar;
    this.cd.detectChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(
      this.onlineEvent.subscribe((e: any) => {
        this.isOffline = false;
        this.openSnackBar();
      })
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e: any) => {
        this.isOffline = true;
        this.openSnackBar();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  showFiller = false;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar() {
    this._snackBar.openFromComponent(OfflineSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onToggleDrawer() {
    this.viewMissionService.isDrawerOpened =
      !this.viewMissionService.isDrawerOpened;
  }

  onUpdateVersion() {
    if (!this.swUpdate.isEnabled) {
      console.log('Not enable to update');
      return;
    }
    this.swUpdate.available.subscribe((event: any) => {
      console.log(`current`, event.current, `available`, event.available);
      if (
        confirm(
          'Phiên bản mới đã sẵn sàng, hãy đồng ý để cập nhật phiên bản mới ngay!!'
        )
      ) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });
    this.swUpdate.activated.subscribe((event: any) => {
      console.log(`current`, event.previous, `available`, event.current);
    });
  }

  checkForUpdate() {
    this.appRef.isStable.subscribe((isStable: any) => {
      if (!isStable) {
        this.swUpdate.checkForUpdate().then(() => {
          console.log('update checked');
          this.onUpdateVersion();
          location.reload();
        });
      }
    });
  }

  pushSubscription() {
    if (!this.swUpdate.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey,
    }).then((sub: any) => console.log(JSON.stringify(sub))).catch((error: any) => console.log(error));
  }

  checkMessage() {
    this.swPush.messages.subscribe((message: any) => console.log(message))
  }

  notificationClicks() {
    this.swPush.notificationClicks.subscribe(({action, notification}) => {
      window.open(notification.data.url)
    })
  }

  autoCheckForUpdate() {
    this.appRef.isStable.subscribe((isStable: any) => {
      if (!isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);
        // const timeInterval = interval(2000);
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => {
            console.log('auto check for update');
            this.onUpdateVersion();
            location.reload();
          });
        });
      }
    });
  }

  async installPWA() {
    this.isShowButtonInstall = false;
    // Show the install prompt
    this.deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    const {outcome} = await this.deferredPrompt?.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    this.deferredPrompt = null;
  }

  getPWADisplayMode() {
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } else if (this.isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }

  logout() {
    localStorage.removeItem('token')
    location.reload()
  }

  goToScreen(path: any) {
    this.router.navigate([path])
  }
}
