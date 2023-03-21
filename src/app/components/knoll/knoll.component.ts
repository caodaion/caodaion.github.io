import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-knoll',
  templateUrl: './knoll.component.html',
  styleUrls: ['./knoll.component.scss']
})
export class KnollComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (this.eRef) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.isShowTool = false
      }
    }
  }
  isPhone: boolean = false;
  isShowTool: boolean = false;
  koll = {
    dropPoint: {
      x: `calc(${window.innerWidth}px - 56px - 16px)`,
      y: `calc(${window.innerHeight}px - 56px - 150px)`
    }
  };

  constructor(private eRef: ElementRef,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (!localStorage.getItem('koll') || localStorage.getItem('koll') == '{}') {
          this.koll = {
            dropPoint: {
              x: '',
              y: ''
            }
          }
        } else {
          this.koll = JSON.parse(localStorage.getItem('koll') || '{}')
          this.koll.dropPoint.x = `${this.koll.dropPoint.x}px`
          this.koll.dropPoint.y = `${this.koll.dropPoint.y}px`
        }
        if (state.matches) {
          this.isPhone = true;
          if (!this.koll?.dropPoint?.y || parseInt(this.koll?.dropPoint?.y) > window.innerHeight) {
            this.koll.dropPoint.y = `calc(${window.innerHeight}px - 56px - 80px - 16px)`
          }
          if (!this.koll?.dropPoint?.x || parseInt(this.koll?.dropPoint?.x) > window.innerWidth) {
            this.koll.dropPoint.x = `calc(${window.innerWidth}px - 56px - 16px)`
          }
        } else {
          this.isPhone = false;
          if (!this.koll?.dropPoint?.y || parseInt(this.koll?.dropPoint?.y) > window.innerHeight) {
            this.koll.dropPoint.y = `calc(${window.innerHeight}px - 56px - 16px)`
          }
          if (!this.koll?.dropPoint?.x || parseInt(this.koll?.dropPoint?.x) > window.innerWidth) {
            this.koll.dropPoint.x = `calc(${window.innerWidth}px - 56px - 32px)`
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
    localStorage.setItem('koll', JSON.stringify({ dropPoint: event.dropPoint }))
  }
}
