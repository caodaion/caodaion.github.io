import { Injectable } from '@angular/core';

export interface ScrollPosition {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  private scrollPositions = new Map<string, ScrollPosition>();
  private readonly STORAGE_KEY = 'scroll_positions';
  allowedPages = ['/kinh']

  constructor() {
    this.loadScrollPositions();
  }

  /**
   * Save scroll position for a specific route
   * @param routeUrl The route URL
   * @param position The scroll position
   */
  saveScrollPosition(routeUrl: string, position: ScrollPosition): void {
    if (!this.allowedPages.some(page => routeUrl === page)) return;
    // If position is at the origin (0,0), remove any existing stored position
    if (position.x === 0 && position.y === 0) {
      if (this.scrollPositions.has(routeUrl)) {
        console.log('Removing stored scroll position for route:', routeUrl, 'user scrolled to top');
        this.scrollPositions.delete(routeUrl);
        this.persistScrollPositions();
      } else {
        console.log('Skipping save for route:', routeUrl, 'position is at origin (0,0) and no existing position');
      }
      return;
    }

    console.log('Saving scroll position for route:', routeUrl, position);
    this.scrollPositions.set(routeUrl, position);
    this.persistScrollPositions();
  }

  /**
   * Get saved scroll position for a specific route
   * @param routeUrl The route URL
   * @returns The saved scroll position or null if not found
   */
  getScrollPosition(routeUrl: string): ScrollPosition | null {
    return this.scrollPositions.get(routeUrl) || null;
  }

  /**
   * Get current scroll position of the window or main scrollable container
   * @returns Current scroll position
   */
  getCurrentScrollPosition(): ScrollPosition {
    // Try multiple possible scrollable containers in order of priority
    const possibleContainers = [
      '.main-container',
      '.kinh-container',
      '.page-container',
      '.content-container'
    ];

    for (const selector of possibleContainers) {
      const container = document.querySelector(selector) as HTMLElement;
      if (container && (container.scrollTop > 0 || container.scrollLeft > 0)) {
        const x = container.scrollLeft || 0;
        const y = container.scrollTop || 0;
        console.log(`Current scroll position detected from ${selector}:`, { x, y });
        return { x, y };
      }
    }

    // Check main-container even if scroll is 0 (it might be the right container)
    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    if (mainContainer) {
      const x = mainContainer.scrollLeft || 0;
      const y = mainContainer.scrollTop || 0;
      console.log('Current scroll position detected from .main-container (default):', { x, y });
      return { x, y };
    }

    // Fallback to window scroll for backward compatibility
    const x = window.scrollX ?? window.pageXOffset ?? document.documentElement.scrollLeft ?? document.body.scrollLeft ?? 0;
    const y = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;

    console.log('Current scroll position detected from window (fallback):', { x, y });

    return { x, y };
  }

  /**
   * Restore scroll position to the window or main scrollable container
   * @param position The scroll position to restore
   */
  restoreScrollPosition(position: ScrollPosition): void {
    console.log('Restoring scroll position:', position);

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Try multiple possible scrollable containers in order of priority
      const possibleContainers = [
        '.main-container',
        '.kinh-container',
        '.page-container',
        '.content-container'
      ];

      for (const selector of possibleContainers) {
        const container = document.querySelector(selector) as HTMLElement;
        if (container) {
          container.scrollTo({
            left: position.x,
            top: position.y,
            behavior: 'auto' // Instant scroll, no smooth animation
          });

          // Fallback for older browsers
          if (container.scrollTop !== position.y || container.scrollLeft !== position.x) {
            container.scrollLeft = position.x;
            container.scrollTop = position.y;
          }

          console.log(`Scroll position restored to ${selector}`);
          return;
        }
      }

      // Fallback to window scroll
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior: 'auto'
      });

      // Fallback for older browsers
      if (window.scrollY !== position.y || window.scrollX !== position.x) {
        window.scrollTo(position.x, position.y);
      }

      console.log('Scroll position restored to window (fallback)');
    }, 100); // Longer delay for complex pages like kinh
  }

  /**
   * Clear scroll position for a specific route
   * @param routeUrl The route URL
   */
  clearScrollPosition(routeUrl: string): void {
    this.scrollPositions.delete(routeUrl);
    this.persistScrollPositions();
  }

  /**
   * Clear all saved scroll positions
   */
  clearAllScrollPositions(): void {
    this.scrollPositions.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Load scroll positions from localStorage
   */
  private loadScrollPositions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const positions = JSON.parse(stored);
        const filteredPositions: Record<string, ScrollPosition> = {};
        for (const [routeUrl, position] of Object.entries(positions)) {
          if (this.allowedPages.some(page => routeUrl === page)) {
            filteredPositions[routeUrl] = position as ScrollPosition;
          }
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPositions));
        this.scrollPositions = new Map(Object.entries(filteredPositions));
        console.log('Removed scroll positions not in allowedPages');
        this.scrollPositions = new Map(Object.entries(positions));
      }
    } catch (error) {
      console.warn('Failed to load scroll positions from localStorage:', error);
    }
  }

  /**
   * Persist scroll positions to localStorage
   */
  private persistScrollPositions(): void {
    try {
      const positions = Object.fromEntries(this.scrollPositions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.warn('Failed to save scroll positions to localStorage:', error);
    }
  }
}