import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScrollPositionService } from '../scroll-position/scroll-position.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollManagerService {
  private previousRoute: string | null = null;
  private currentRoute: string | null = null;

  constructor(
    private router: Router,
    private scrollPositionService: ScrollPositionService
  ) {
    this.initializeScrollManagement();
  }

  /**
   * Initialize scroll position management
   */
  private initializeScrollManagement(): void {
    // Save scroll position before navigation starts
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.saveCurrentScrollPositionIfExists();
      });

    // Restore scroll position after navigation ends
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleRouteEnd(event.urlAfterRedirects);
      });

    // Listen to scroll events to clean up positions when user scrolls to top
    this.setupScrollListener();
  }

  /**
   * Setup scroll listener to detect when user scrolls back to top
   */
  private setupScrollListener(): void {
    // Throttle scroll events to avoid excessive calls
    let scrollTimeout: any;
    
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        if (this.currentRoute) {
          const position = this.scrollPositionService.getCurrentScrollPosition();
          
          // If user scrolled to top, remove the stored position
          if (position.x === 0 && position.y === 0) {
            const existingPosition = this.scrollPositionService.getScrollPosition(this.currentRoute);
            if (existingPosition) {
              console.log('User scrolled to top, cleaning up stored position for:', this.currentRoute);
              this.scrollPositionService.clearScrollPosition(this.currentRoute);
            }
          }
        }
      }, 300); // Throttle to 300ms
    };

    // Listen to scroll events on potential scrollable containers
    const possibleContainers = [
      '.main-container',
      '.kinh-container', 
      '.page-container',
      '.content-container'
    ];
    
    for (const selector of possibleContainers) {
      const container = document.querySelector(selector) as HTMLElement;
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
      }
    }
    
    // Also listen to window scroll as fallback
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Save scroll position for current route if it exists
   */
  private saveCurrentScrollPositionIfExists(): void {
    if (this.currentRoute) {
      const scrollPosition = this.scrollPositionService.getCurrentScrollPosition();
      console.log('Saving scroll position for route:', this.currentRoute, scrollPosition);
      this.scrollPositionService.saveScrollPosition(this.currentRoute, scrollPosition);
    }
  }

  /**
   * Handle navigation end - update current route and restore position
   * @param newRoute The new route URL
   */
  private handleRouteEnd(newRoute: string): void {
    // Update route tracking
    this.previousRoute = this.currentRoute;
    this.currentRoute = newRoute;

    // Restore scroll position for the new route
    this.restoreScrollPosition(newRoute);
  }

  /**
   * Handle route changes - save previous scroll position and restore current
   * @param newRoute The new route URL
   */
  private handleRouteChange(newRoute: string): void {
    // Save scroll position for the previous route
    if (this.currentRoute) {
      const scrollPosition = this.scrollPositionService.getCurrentScrollPosition();
      this.scrollPositionService.saveScrollPosition(this.currentRoute, scrollPosition);
    }

    // Update route tracking
    this.previousRoute = this.currentRoute;
    this.currentRoute = newRoute;

    // Restore scroll position for the new route
    this.restoreScrollPosition(newRoute);
  }

  /**
   * Restore scroll position for a route
   * @param route The route URL
   */
  private restoreScrollPosition(route: string): void {
    const savedPosition = this.scrollPositionService.getScrollPosition(route);
    
    if (savedPosition) {
      // Restore the saved position
      this.scrollPositionService.restoreScrollPosition(savedPosition);
    } else {
      // If no saved position, scroll to top (default behavior)
      this.scrollToTop();
    }
  }

  /**
   * Manually save current scroll position for the current route
   */
  public saveCurrentScrollPosition(): void {
    if (this.currentRoute) {
      const scrollPosition = this.scrollPositionService.getCurrentScrollPosition();
      this.scrollPositionService.saveScrollPosition(this.currentRoute, scrollPosition);
    }
  }

  /**
   * Manually restore scroll position for the current route
   */
  public restoreCurrentScrollPosition(): void {
    if (this.currentRoute) {
      this.restoreScrollPosition(this.currentRoute);
    }
  }

  /**
   * Scroll to top of the page
   */
  public scrollToTop(): void {
    // Try to scroll multiple possible containers
    const possibleContainers = [
      '.main-container',
      '.kinh-container', 
      '.page-container',
      '.content-container'
    ];
    
    for (const selector of possibleContainers) {
      const container = document.querySelector(selector) as HTMLElement;
      if (container) {
        container.scrollTo(0, 0);
        return;
      }
    }
    
    // Fallback to window scroll
    window.scrollTo(0, 0);
  }

  /**
   * Clear scroll position for a specific route
   * @param route The route URL
   */
  public clearScrollPosition(route: string): void {
    this.scrollPositionService.clearScrollPosition(route);
  }

  /**
   * Clear all scroll positions
   */
  public clearAllScrollPositions(): void {
    this.scrollPositionService.clearAllScrollPositions();
  }

  /**
   * Get current route
   */
  public getCurrentRoute(): string | null {
    return this.currentRoute;
  }

  /**
   * Get previous route
   */
  public getPreviousRoute(): string | null {
    return this.previousRoute;
  }
}