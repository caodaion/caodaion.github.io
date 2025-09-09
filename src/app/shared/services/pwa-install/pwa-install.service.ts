import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installable = new BehaviorSubject<boolean>(false);

  constructor() {
    this.listenForInstallPrompt();
    this.checkIfInstalled();
  }

  get installable$(): Observable<boolean> {
    return this.installable.asObservable();
  }

  get canInstall(): boolean {
    return this.installable.value && !!this.deferredPrompt;
  }

  get isInstalled(): boolean {
    // Check if running as standalone (installed PWA)
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.installable.next(true);
      
      console.log('PWA install prompt is available');
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
      this.installable.next(false);
    });
  }

  private checkIfInstalled(): void {
    // If app is already installed, don't show install button
    if (this.isInstalled) {
      this.installable.next(false);
    }
  }

  async installPwa(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('Install prompt is not available');
      return false;
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.deferredPrompt = null;
        this.installable.next(false);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }

  // For iOS Safari - provide instructions
  showIOSInstallInstructions(): boolean {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone;
    
    return isIOS && !isInStandaloneMode;
  }

  // Get platform-specific install instructions
  getInstallInstructions(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/ipad|iphone|ipod/.test(userAgent)) {
      return 'Để cài đặt ứng dụng này trên thiết bị iOS, nhấn vào nút Chia sẻ và chọn "Thêm vào Màn hình chính"';
    } else if (/android/.test(userAgent)) {
      return 'Để cài đặt ứng dụng này trên thiết bị Android, nhấn vào nút "Cài đặt" hoặc vào menu trình duyệt và chọn "Thêm vào màn hình chính"';
    } else {
      return 'Để cài đặt ứng dụng này, nhấn vào nút "Cài đặt" hoặc tìm biểu tượng cài đặt trong thanh địa chỉ của trình duyệt';
    }
  }
}
