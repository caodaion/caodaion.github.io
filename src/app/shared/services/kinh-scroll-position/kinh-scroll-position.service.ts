import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface KinhScrollPosition {
  selectedKinhKey: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class KinhScrollPositionService {
  private readonly STORAGE_KEY = 'kinh-scroll-position';
  private readonly KINH_ITEM_SELECTOR = '[data-kinh-key]';
  private readonly LIST_CONTAINER_SELECTOR = '.main-container';
  private readonly BOTTOM_SHEET_CONTAINER_SELECTOR = '.kinh-list-bottom-sheet mat-bottom-sheet-container';

  private scrollPosition$ = new BehaviorSubject<KinhScrollPosition>({
    selectedKinhKey: null
  });

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get current scroll position observable
   */
  getScrollPosition() {
    return this.scrollPosition$.asObservable();
  }

  /**
   * Get current scroll position value
   */
  getCurrentPosition(): KinhScrollPosition {
    return this.scrollPosition$.value;
  }

  /**
   * Set the selected kinh key and update visual indicators
   * @param kinhKey The key of the selected kinh
   */
  setSelectedKinhKey(kinhKey: string): void {
    const updated = { selectedKinhKey: kinhKey };
    this.scrollPosition$.next(updated);
    this.saveToStorage(updated);
    
    // Update visual indicators in both contexts
    this.updateSelectedIndicators(kinhKey);
  }

  /**
   * Update selected indicators in all visible containers
   * @param kinhKey The key of the selected kinh
   */
  private updateSelectedIndicators(kinhKey: string): void {
    // Update in list container
    const listContainer = document.querySelector(this.LIST_CONTAINER_SELECTOR);
    if (listContainer) {
      this.clearSelectedIndicators(listContainer);
      const listElement = listContainer.querySelector(`[data-kinh-key="${kinhKey}"]`) as HTMLElement;
      if (listElement) {
        this.addSelectedIndicator(listElement);
      }
    }

    // Update in bottom sheet container
    const bottomSheetContainer = document.querySelector(this.BOTTOM_SHEET_CONTAINER_SELECTOR);
    if (bottomSheetContainer) {
      this.clearSelectedIndicators(bottomSheetContainer);
      const bottomSheetElement = bottomSheetContainer.querySelector(`[data-kinh-key="${kinhKey}"]`) as HTMLElement;
      if (bottomSheetElement) {
        this.addSelectedIndicator(bottomSheetElement);
      }
    }
  }

  /**
   * Scroll to the selected kinh in list view
   * @param containerSelector Optional custom container selector
   */
  scrollToSelectedKinhInList(containerSelector?: string): void {
    const selectedKey = this.scrollPosition$.value.selectedKinhKey;
    if (!selectedKey) {
      console.log('No selected kinh key found for scrolling');
      return;
    }
    this.scrollToKinhElement(selectedKey, containerSelector || this.LIST_CONTAINER_SELECTOR);
  }

  /**
   * Scroll to the selected kinh in bottom sheet
   */
  scrollToSelectedKinhInBottomSheet(): void {
    const selectedKey = this.scrollPosition$.value.selectedKinhKey;
    if (!selectedKey) {
      console.log('No selected kinh key found for bottom sheet scrolling');
      return;
    }
    this.scrollToKinhElement(selectedKey, this.BOTTOM_SHEET_CONTAINER_SELECTOR);
  }

  /**
   * Scroll to top of the main container to ensure headers are visible
   */
  scrollToTop(): void {
    const container = document.querySelector(this.LIST_CONTAINER_SELECTOR) || document.body;
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }


  /**
   * Clear selected kinh key
   */
  clear(): void {
    const cleared: KinhScrollPosition = {
      selectedKinhKey: null
    };
    
    this.scrollPosition$.next(cleared);
    this.saveToStorage(cleared);
  }

  /**
   * Scroll to a specific kinh element
   * @param kinhKey The kinh key to scroll to
   * @param containerSelector The container selector
   */
  private scrollToKinhElement(kinhKey: string, containerSelector: string): void {    
    // Try immediate scroll first
    this.performScroll(kinhKey, containerSelector);
    
    // Also try with minimal delay as fallback
    setTimeout(() => {
      this.performScroll(kinhKey, containerSelector);
    }, 100);
  }

  private performScroll(kinhKey: string, containerSelector: string): void {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.log('Container not found:', containerSelector);
      return;
    }

    const kinhElement = container.querySelector(`[data-kinh-key="${kinhKey}"]`) as HTMLElement;
    if (!kinhElement) {
      // Try to find all available kinh keys for debugging
      const allKinhElements = container.querySelectorAll('[data-kinh-key]');
      return;
    }    
    // Remove previous selected indicators
    this.clearSelectedIndicators(container);
    
    // Add selected indicator to current element
    this.addSelectedIndicator(kinhElement);
    
    // Calculate position to center the element in view
    const containerRect = container.getBoundingClientRect();
    const elementRect = kinhElement.getBoundingClientRect();
    
    const scrollTop = container.scrollTop + elementRect.top - containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);
    
    container.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    });

    // Add temporary highlight effect
    this.highlightElement(kinhElement);
  }

  /**
   * Add selected indicator (dashed border) to an element
   * @param element The element to mark as selected
   */
  private addSelectedIndicator(element: HTMLElement): void {
    element.classList.add('kinh-selected');
    
    // Add inline styles for immediate effect
    element.style.border = '2px dashed #4285f4';
    element.style.borderRadius = '8px';
    element.style.transition = 'all 0.2s ease';
  }

  /**
   * Clear all selected indicators from a container
   * @param container The container to clear indicators from
   */
  private clearSelectedIndicators(container: Element): void {
    const selectedElements = container.querySelectorAll('.kinh-selected');
    selectedElements.forEach(element => {
      element.classList.remove('kinh-selected');
      const htmlElement = element as HTMLElement;
      htmlElement.style.border = '';
      htmlElement.style.borderRadius = '';
      htmlElement.style.transition = '';
    });
  }

  /**
   * Add temporary highlight effect to an element
   * @param element The element to highlight
   */
  private highlightElement(element: HTMLElement): void {
    // Add a subtle pulse effect over the dashed border
    element.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.2)';
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 1000);
  }

  /**
   * Load position from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const position = JSON.parse(stored) as KinhScrollPosition;
        this.scrollPosition$.next(position);
      }
    } catch (error) {
      console.warn('Failed to load kinh scroll position from storage:', error);
    }
  }

  /**
   * Save position to localStorage
   * @param position Position to save
   */
  private saveToStorage(position: KinhScrollPosition): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(position));
    } catch (error) {
      console.warn('Failed to save kinh scroll position to storage:', error);
    }
  }
}
