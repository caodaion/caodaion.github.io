import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private showToolbar = new BehaviorSubject<boolean>(true);
  private showBottomNav = new BehaviorSubject<boolean>(true);
  private showCalendarNav = new BehaviorSubject<boolean>(true);

  public showToolbar$ = this.showToolbar.asObservable();
  public showBottomNav$ = this.showBottomNav.asObservable();
  public showCalendarNav$ = this.showCalendarNav.asObservable();
    toggleDrawer: any;

  constructor() {}

  /**
   * Set toolbar visibility
   * @param show Boolean to determine visibility
   */
  setToolbarVisibility(show: boolean): void {
    this.showToolbar.next(show);
  }

  /**
   * Set bottom navigation visibility
   * @param show Boolean to determine visibility
   */
  setBottomNavVisibility(show: boolean): void {
    this.showBottomNav.next(show);
  }

  /**
   * Set bottom navigation visibility
   * @param show Boolean to determine visibility
   */
  setCalendarNavVisibility(show: boolean): void {
    this.showCalendarNav.next(show);
  }

  /**
   * Hide both toolbar and bottom navigation
   */
  hideNavigation(): void {
    this.showToolbar.next(false);
    this.showBottomNav.next(false);
  }

  /**
   * Show both toolbar and bottom navigation
   */
  showNavigation(): void {
    this.showToolbar.next(true);
    this.showBottomNav.next(true);
  }
}