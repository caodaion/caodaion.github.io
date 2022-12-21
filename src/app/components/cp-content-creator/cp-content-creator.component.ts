import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { AuthService } from "../../shared/services/auth/auth.service";

@Component({
  selector: 'cp-content-creator',
  templateUrl: './cp-content-creator.component.html',
  styleUrls: ['./cp-content-creator.component.scss']
})
export class CpContentCreatorComponent implements OnChanges, AfterViewInit {
  @Input() data: any;
  @Output() save = new EventEmitter();
  isShowController: boolean = false;
  focusedBlock: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver, private authService: AuthService) {
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
    } else {
      this.audioPlayer.nativeElement.pause()
    }
  }

  audioTracking() {
    if (this.data.type == 'block') {
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
              }
            }
          }
        })
      } else {
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          console.log(currentTime);
          navigator.clipboard.writeText(currentTime)
        })
      }
    }
  }
}
