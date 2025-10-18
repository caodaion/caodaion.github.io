import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  private confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
  private confettiAnimations = ['slow', 'medium', 'fast'];

  // Predefined duration configurations
  private durationConfigs = {
    short: 3000,
    medium: 5000,
    long: 8000,
    celebration: 10000
  };

  /**
   * Get duration and intensity based on input
   * @param input Can be a number (milliseconds), string key, or performance percentage
   * @returns Object with duration and intensity
   */
  private getDurationConfig(input?: number | string): { duration: number; intensity: 'light' | 'medium' | 'heavy' } {
    // If no input provided, use default
    if (input === undefined || input === null) {
      return { duration: this.durationConfigs.medium, intensity: 'medium' };
    }

    // If input is a number
    if (typeof input === 'number') {
      // If it's a percentage (0-100), calculate based on performance
      if (input >= 0 && input <= 100) {
        if (input === 100) {
          return { duration: this.durationConfigs.celebration, intensity: 'heavy' };
        } else if (input >= 80) {
          return { duration: this.durationConfigs.long, intensity: 'medium' };
        } else if (input >= 60) {
          return { duration: this.durationConfigs.medium, intensity: 'light' };
        } else {
          return { duration: this.durationConfigs.short, intensity: 'light' };
        }
      }
      // If it's a direct duration in milliseconds
      else {
        // Determine intensity based on duration
        if (input >= 8000) {
          return { duration: input, intensity: 'heavy' };
        } else if (input >= 5000) {
          return { duration: input, intensity: 'medium' };
        } else {
          return { duration: input, intensity: 'light' };
        }
      }
    }

    // If input is a string key
    if (typeof input === 'string' && input in this.durationConfigs) {
      const duration = this.durationConfigs[input as keyof typeof this.durationConfigs];
      // Determine intensity based on predefined duration
      if (duration >= 8000) {
        return { duration, intensity: 'heavy' };
      } else if (duration >= 5000) {
        return { duration, intensity: 'medium' };
      } else {
        return { duration, intensity: 'light' };
      }
    }

    // Fallback to default
    return { duration: this.durationConfigs.medium, intensity: 'medium' };
  }

  generateConfetti(container: HTMLElement, input?: number | string): void {
    container.classList.add('confetti-container');

    // Get duration and intensity based on input
    const { duration, intensity } = this.getDurationConfig(input);

    // Adjust confetti generation frequency based on intensity
    const intervals = {
      light: 50,   // Every 50ms - less frequent
      medium: 25,  // Every 25ms - default
      heavy: 15    // Every 15ms - more frequent
    };

    const confettiInterval = setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px';
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
      const confettiLeft = Math.floor(Math.random() * container.offsetWidth) + 'px';
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];

      confettiEl.classList.add('confetti', `confetti--animation-${confettiAnimation}`);
      confettiEl.style.position = 'absolute';
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;

      container.appendChild(confettiEl);

      setTimeout(() => {
        confettiEl.remove();
      }, duration);
    }, intervals[intensity]);

    setTimeout(() => {
      clearInterval(confettiInterval);
    }, duration);
  }

  /**
   * Get the calculated duration for a given input
   * Useful for components that need to know the duration for timing other actions
   * @param input Can be a number (milliseconds), string key, or performance percentage
   * @returns The calculated duration in milliseconds
   */
  getCalculatedDuration(input?: number | string): number {
    return this.getDurationConfig(input).duration;
  }

  /**
   * Get available duration presets
   * @returns Object with available duration presets
   */
  getDurationPresets(): typeof this.durationConfigs {
    return { ...this.durationConfigs };
  }
}