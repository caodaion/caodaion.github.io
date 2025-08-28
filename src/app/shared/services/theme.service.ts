import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'caodaion-dark-mode';
  private darkModeSubject = new BehaviorSubject<boolean>(this.initializeDarkMode());
  public darkMode$ = this.darkModeSubject.asObservable();
  
  // Color values for theme-color meta tag
  private readonly lightThemeColor = '#ffffff'; // White for light mode
  private readonly darkThemeColor = '#121212'; // Dark background for dark mode

  constructor() {
    // Initialize theme on service creation
    this.applyTheme(this.darkModeSubject.value);
    
    // Listen for system theme changes
    this.listenForSystemThemeChanges();
  }

  private initializeDarkMode(): boolean {
    // Check localStorage first
    const savedPreference = localStorage.getItem(this.darkModeKey);
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    
    // Otherwise use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private listenForSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only change theme if user hasn't explicitly set a preference
      if (localStorage.getItem(this.darkModeKey) === null) {
        this.setDarkMode(e.matches);
      }
    });
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(isDark: boolean): void {
    // Save preference to localStorage
    localStorage.setItem(this.darkModeKey, String(isDark));
    
    // Update subject
    this.darkModeSubject.next(isDark);
    
    // Apply theme to document
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      this.updateThemeColorMetaTag(this.darkThemeColor);
    } else {
      document.documentElement.classList.remove('dark-theme');
      this.updateThemeColorMetaTag(this.lightThemeColor);
    }
  }
  
  /**
   * Updates the theme-color meta tag in the document head
   * @param color The color value to set for the theme-color
   */
  private updateThemeColorMetaTag(color: string): void {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      // Create the meta tag if it doesn't exist
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    // Set the color value
    metaThemeColor.setAttribute('content', color);
  }
}