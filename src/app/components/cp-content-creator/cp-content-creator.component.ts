import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { AuthService } from "../../shared/services/auth/auth.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-content-creator',
  templateUrl: './cp-content-creator.component.html',
  styleUrls: ['./cp-content-creator.component.scss']
})
export class CpContentCreatorComponent implements OnChanges, AfterViewInit {
  @Input() data: any;
  @Output() save = new EventEmitter();
  @Output() nextContent = new EventEmitter();
  isShowController: boolean = false;
  isAutoPlay: boolean = false;
  focusedBlock: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private route: ActivatedRoute
    ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.isShowController = !state.matches && this.authService.contentEditable;
      });
  }

  ngAfterViewInit(): void {
    this.audioTracking()
  }

  ngOnChanges() {
    if (!this.data.content || this.data.content.length == 0) {
      if (this.data.type == 'block') {
        this.data.content = [
          {
            // @ts-ignore
            key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${(this.data.content.length - 1) || 0}`,
            attrs: {
              pathname: location.pathname,
              hash: `#${this.data.content.length - 1}`
            },
            type: 'contentBlock'
          }
        ]
      }
    }
    if (!this.data.key) {
      this.data.content = [
        {
          // @ts-ignore
          key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${(this.data.content?.length - 1) || 0}`,
          attrs: {
            pathname: location.pathname,
            hash: `#${(this.data.content?.length - 1) || 0}`
          },
          type: 'contentBlock'
        }
      ]
    }
  }

  getId(block: any) {
    return block.key.replaceAll('-', '')
  }

  saveData() {
    this.save.emit()
  }

  contentToContent(event: any) {
    if (event?.audio?.start) {
      this.audioPlayer.nativeElement.currentTime = event.audio.start
      const currentTime = this.audioPlayer.nativeElement.currentTime
      navigator.clipboard.writeText(currentTime)
      localStorage.setItem('audio', JSON.stringify({
        content: this.data.key,
        currentTime: currentTime
      }))
    } else {
      // this.audioPlayer.nativeElement.pause()
    }
  }

  audioTracking() {
    if (this.data.type == 'block' && !!this.audioPlayer) {
      this.route.queryParams.subscribe((query) => {
        if (query['isAutoPlayAudio']) {
          this.audioPlayer.nativeElement.autoplay = true
        }
      })
      if (!this.authService.contentEditable) {
        this.audioPlayer.nativeElement.addEventListener('timeupdate', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          let timeStampContent = this.data.content.find((item: any) => {
            return currentTime > item?.audio?.start && currentTime < item?.audio?.end
          })
          if (timeStampContent) {
            const targetAudioContent = document.getElementById(timeStampContent.key)
            if (targetAudioContent) {
              if (!targetAudioContent.style.color || targetAudioContent.style.color == 'unset') {
                const creatorContentEditable = document.getElementsByTagName('cp-creator-content')
                Array.from({ length: creatorContentEditable.length }, (x, i) => {
                  creatorContentEditable[i].setAttribute('style', 'color: unset')
                })
                targetAudioContent.style.color = '#4285f4'
                localStorage.setItem('audio', JSON.stringify({
                  content: this.data.key,
                  currentTime: currentTime
                }))
              }
            }
          }
        })
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          localStorage.setItem('audio', JSON.stringify({
            content: this.data.key,
            currentTime: currentTime
          }))
          if (JSON.parse(localStorage.getItem('audio') || '').currentTime == this.data.content[this.data.content.length - 1].audio.end) {
            this.nextContent.emit()
          }
        })
      } else {
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          navigator.clipboard.writeText(currentTime)
          localStorage.setItem('audio', JSON.stringify({
            content: this.data.key,
            currentTime: currentTime
          }))
        })
      }
    }
  }
}
