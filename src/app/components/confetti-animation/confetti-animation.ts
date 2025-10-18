import { Component, ElementRef, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfettiService } from '../../shared/services/confetti.service';

@Component({
  selector: 'app-confetti-animation',
  templateUrl: './confetti-animation.html',
  styleUrl: './confetti-animation.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class ConfettiAnimation implements AfterViewInit {
  @Input() input?: number | string; // Can be percentage, duration in ms, or preset key
  constructor(private el: ElementRef, private confettiService: ConfettiService) { }

  ngAfterViewInit(): void {
    this.onGenerateConfetti();
  }

  onGenerateConfetti(): void {
    const container = this.el.nativeElement.querySelector('.js-container');
    if (container) {
      this.confettiService.generateConfetti(container, this.input);
    }
  }
}
