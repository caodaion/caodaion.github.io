import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ScrollManagerService } from '../services/scroll-manager/scroll-manager.service';

@Directive({
  selector: '[appScrollPosition]',
  standalone: true
})
export class ScrollPositionDirective implements OnInit, OnDestroy {
  private scrollSaveInterval: any;

  constructor(private scrollManagerService: ScrollManagerService) {}

  ngOnInit(): void {
    // Optionally save scroll position periodically for long-scrolling pages
    this.scrollSaveInterval = setInterval(() => {
      this.scrollManagerService.saveCurrentScrollPosition();
    }, 5000); // Save every 5 seconds
  }

  ngOnDestroy(): void {
    // Save scroll position when component is destroyed
    this.scrollManagerService.saveCurrentScrollPosition();
    
    if (this.scrollSaveInterval) {
      clearInterval(this.scrollSaveInterval);
    }
  }
}