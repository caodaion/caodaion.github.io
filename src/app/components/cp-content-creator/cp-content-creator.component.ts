import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
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
  @Input() rootContent: any;
  @Output() save = new EventEmitter();
  @Output() nextContent = new EventEmitter();
  isShowController: boolean = false;
  isAutoPlay: boolean = false;
  audioReadyToPlay: boolean = false;
  fromLocalStorage: boolean = true;
  focusedBlock: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
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
    this.audioTracking()
    this.cd.detectChanges()
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
    return block.key?.replaceAll('-', '')
  }

  saveData() {
    this.save.emit()
  }

  contentToContent(event: any) {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }

    const foundFocusBlock = find(this.data.content, event)
    if (this.audioPlayer && foundFocusBlock?.audio?.start) {
      this.audioPlayer.nativeElement.currentTime = foundFocusBlock.audio.start
      const currentTime = this.audioPlayer.nativeElement.currentTime
      if (this.authService.contentEditable) {
        navigator.clipboard.writeText(currentTime)
      }
    } else {
      let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
      if (!studyStorage) {
        studyStorage = []
      }
      let foundItem = studyStorage.find((item: any) => item.key == this.rootContent?.key)
      if (foundItem) {
        foundItem.name = this.data.name
      }
      // this.audioPlayer.nativeElement.pause()
    }
  }

  audioTracking() {
    this.cd.detectChanges()
    if (this.data.type == 'block' && !!this.audioPlayer) {
      this.route.queryParams.subscribe((query) => {
        if (query['autoplay']) {
          this.audioPlayer.nativeElement.autoplay = true
        } else {
          this.audioPlayer.nativeElement.autoplay = history.state.autoplay
        }
      })
      const storedAudio = JSON.parse(localStorage.getItem('reading') || '[]')
      const focusedAudio = this.fromLocalStorage ? storedAudio.find((item: any) => item.content == this.data.key) : this.audioPlayer.nativeElement
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = focusedAudio?.currentTime >= o?.audio?.start && focusedAudio?.currentTime <= o?.audio?.end ? o : find(o.content || [], key));
        return result;
      }
      if (focusedAudio && focusedAudio?.currentTime) {
        let timeStampContent = find(this.data.content, 0)
        this.audioPlayer.nativeElement.currentTime = timeStampContent?.audio?.start || focusedAudio?.currentTime
        this.fromLocalStorage = false
      }
      this.audioPlayer.nativeElement.addEventListener('loadstart', (event: any) => {
        this.audioReadyToPlay = false
      })
      this.audioPlayer.nativeElement.addEventListener('loadeddata', (event: any) => {
        this.audioReadyToPlay = true
        this.cd.detectChanges()
        this.audioPlayer.nativeElement.controls = true
        this.route.queryParams.subscribe((query) => {
          if (query['autoplay']) {
            this.audioPlayer.nativeElement.autoplay = true
          } else {
            this.audioPlayer.nativeElement.autoplay = history.state.autoplay
          }
        })
      })
      this.audioPlayer.nativeElement.addEventListener('canplay', (event: any) => {
        this.audioReadyToPlay = true
        this.cd.detectChanges()
        this.audioPlayer.nativeElement.controls = true
        this.route.queryParams.subscribe((query) => {
          if (query['autoplay']) {
            this.audioPlayer.nativeElement.autoplay = true
          } else {
            this.audioPlayer.nativeElement.autoplay = history.state.autoplay
          }
        })
      })
      if (!this.authService.contentEditable) {
        this.audioPlayer.nativeElement.addEventListener('timeupdate', (event: any) => {
          const currentTime = this.audioPlayer?.nativeElement.currentTime
          let timeStampContent = find(this.data.content, 0)
          if (timeStampContent) {
            this.updateStudy(timeStampContent, currentTime)
            const targetAudioContent = document.getElementById(timeStampContent.key)
            if (targetAudioContent) {
              if (!targetAudioContent.style.color || targetAudioContent.style.color == 'unset') {
                const splits = new Array(document.getElementsByClassName('split'))[0]
                for (let i = 0; i <= splits.length; i++) {
                  splits[i]?.setAttribute('style', 'color: unset')
                }
                targetAudioContent.style.color = '#4285f4'
                let foundData = <any>{}
                if (targetAudioContent) {
                  const parrent = targetAudioContent.parentNode
                  //@ts-ignore
                  if (parrent?.parentNode?.parentNode?.id) {
                    const find = (array: any, key: any) => {
                      let result: any;
                      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
                      return result;
                    }
                    //@ts-ignore
                    foundData = find(this.data.content, parrent?.parentNode?.parentNode?.id)
                    timeStampContent.attrs.pathname = foundData.attrs?.pathname
                  }
                }
                this.updateStudy(timeStampContent, currentTime)
              }
            }
          }
        })
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer?.nativeElement.currentTime
          let timeStampContent = find(this.data.content, 0)
          if (timeStampContent) {
            this.updateStudy(timeStampContent, currentTime)
          }
        })
        this.audioPlayer.nativeElement.addEventListener('ended', (event: any) => {
          const currentTime = this.audioPlayer?.nativeElement.currentTime
          let timeStampContent = find(this.data.content, 0)
          if (timeStampContent) {
            this.updateStudy(timeStampContent, currentTime)
          }
          this.nextContent.emit()
        })
      } else {
        this.audioPlayer.nativeElement.addEventListener('pause', (event: any) => {
          const currentTime = this.audioPlayer?.nativeElement.currentTime
          navigator.clipboard.writeText(currentTime)
          let timeStampContent = find(this.data.content, 0)
          if (timeStampContent) {
            this.updateStudy(timeStampContent, currentTime)
          }
        })
      }
    }
    this.cd.detectChanges()
  }

  updateStudy(timeStampContent: any, currentTime: any) {
    let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
    if (!studyStorage) {
      studyStorage = []
    }
    let foundItem = studyStorage.find((item: any) => item.key == this.rootContent.key)
    if (foundItem) {
      foundItem.name = this.data.name
      foundItem.content = this.data.key
      foundItem.currentTime = currentTime
      foundItem.location = `${location.origin}${this.data?.attrs?.pathname}${this.data?.attrs?.hash}#${timeStampContent?.key}`
      foundItem.stopAt = timeStampContent?.text || timeStampContent?.content[0].content[0].text
    } else {
      studyStorage.push({
        name: this.data.name,
        content: this.data.key,
        key: this.rootContent.key,
        currentTime: currentTime,
        location: `${location.origin}${this.data?.attrs?.pathname}${this.data?.attrs?.hash}#${timeStampContent?.key}`,
        stopAt: timeStampContent?.text || timeStampContent?.content[0].content[0].text,
      })
    }
    localStorage.setItem('reading', JSON.stringify(studyStorage))
  }
}
