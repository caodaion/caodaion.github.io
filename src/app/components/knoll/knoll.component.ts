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
        // this.play()
      }
    }
  }
  isPhone: boolean = false;
  isShowTool: boolean = false;
  koll: any;

  constructor(private eRef: ElementRef,
    private breakpointObserver: BreakpointObserver
    ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.koll = JSON.parse(localStorage.getItem('koll') || '{}')
        if (state.matches) {
          this.isPhone = true;
          if (this.koll.dropPoint.y > window.innerHeight) {
            this.koll.dropPoint.y = `calc(${window.innerHeight}px - 150px)`
          }
          if (this.koll.dropPoint.x > window.innerWidth) {
            this.koll.dropPoint.x = `calc(${window.innerWidth}px - 56px - 16px)`
          }
        } else {
          this.isPhone = false;
          if (this.koll.dropPoint.y > window.innerHeight) {
            this.koll.dropPoint.y = `calc(${window.innerHeight}px - 16px)`
          }
          if (this.koll.dropPoint.x > window.innerWidth) {
            this.koll.dropPoint.x = `calc(${window.innerWidth}px - 56px - 16px)`
          }
        }
      });
  }

  play() {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.currentTime = 0.1
      this.audioPlayer.nativeElement.play()
    }
  }

  onDragEnded(event: any) {
    localStorage.setItem('koll', JSON.stringify({dropPoint: event.dropPoint}))
    this.isShowTool = false
  }
}
