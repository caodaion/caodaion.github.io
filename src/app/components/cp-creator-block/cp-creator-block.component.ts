import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth/auth.service";

@Component({
  selector: 'cp-creator-block',
  templateUrl: './cp-creator-block.component.html',
  styleUrls: ['./cp-creator-block.component.scss']
})
export class CpCreatorBlockComponent implements OnChanges, AfterViewInit {
  @Input() data: any;
  @Input() rootContent: any;
  @Input() contentEditable: boolean = false;
  @Input() isShowFontSizeSelect: boolean = true;
  @Input() contentFormat = <any>{};
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  playerIcon = 'play_circle'
  @Output() focusedBlock = new EventEmitter()
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.authService.contentEditable && !!this.eRef.nativeElement.contains(event.target)) {
      this.data.focused = true;
      this.focusedBlock.emit(this.data)
    } else {
      this.data.focused = false;
    }
  }

  ngAfterViewInit(): void {
    this.audioTracking()
    console.log(this.contentEditable);

  }

  constructor(
    private _snackBar: MatSnackBar,
    private eRef: ElementRef,
    public authService: AuthService,
    private router: Router
  ) {
  }

  ngOnChanges() {
  }

  getId(block: any) {
    return block.key.replaceAll('-', '')
  }

  getLink(data: any, redirect: boolean = false) {
    if (redirect) {
      if (data?.attrs?.hash?.includes('#')) {
        this.router.navigate([data?.attrs?.pathname], { fragment: data?.attrs?.hash.replace('#', '') })
      } else {
        this.router.navigate([`${data?.attrs?.pathname}${data?.attrs?.hash || ''}`])
      }
    } else {
      navigator.clipboard.writeText(`${location.origin}${data?.attrs?.pathname}${data?.attrs?.hash}`)
      this._snackBar.open('Đã sao chép liên kết đến đoạn kinh này', 'Đóng', {
        duration: this.durationInSeconds * 200,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  changeValue(event: any) {
    this.data.name = event.target.innerText
    event.target.innerText = event.target.innerHTML
  }

  toggleAudioPlayer(player?: any) {
    if (player.paused) {
      player.play()
      player.controls = true
      this.playerIcon = 'pause_circle'
      let currentTime = player.currentTime
      localStorage.setItem('audio', JSON.stringify({
        content: this.data.key,
        currentTime: currentTime
      }))
    } else {
      player.pause()
      player.controls = false
      this.playerIcon = 'play_circle'
      let currentTime = player.currentTime
      localStorage.setItem('audio', JSON.stringify({
        content: this.data.key,
        currentTime: currentTime
      }))
    }
  }

  contentToContent(event: any) {
    if (event?.audio?.start) {
      this.audioPlayer.nativeElement.currentTime = event.audio.start
    } else {
      // this.audioPlayer.nativeElement.pause()
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
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          localStorage.setItem('audio', JSON.stringify({
            content: this.data.key,
            currentTime: currentTime
          }))
        })
      } else {
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer.nativeElement.currentTime
          navigator.clipboard.writeText(currentTime)
          navigator.clipboard.writeText(currentTime)
        })
      }
    }
  }
}
