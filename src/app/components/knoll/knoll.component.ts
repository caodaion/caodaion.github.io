import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-knoll',
  templateUrl: './knoll.component.html',
  styleUrls: ['./knoll.component.scss']
})
export class KnollComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (this.eRef) {
      if (this.eRef.nativeElement.contains(event.target)) {
        this.play()
      }
    }
  }
  isPhone: boolean = false;

  constructor(private eRef: ElementRef,
    private breakpointObserver: BreakpointObserver
    ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isPhone = true;
        } else {
          this.isPhone = false;
        }
      });
  }

  play() {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.currentTime = 0.1
      this.audioPlayer.nativeElement.play()
    }
  }
}
