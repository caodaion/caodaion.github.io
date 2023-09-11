import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CpCreatorContentComponent } from '../cp-creator-content/cp-creator-content.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'cp-content-creator',
  templateUrl: './cp-content-creator.component.html',
  styleUrls: ['./cp-content-creator.component.scss']
})
export class CpContentCreatorComponent implements OnChanges, AfterViewInit {
  [x: string]: any;
  @Input() data: any;
  @Input() rootContent: any;
  @Input() contentEditable: boolean = false;
  @Output() save = new EventEmitter();
  @Output() nextContent = new EventEmitter();
  isShowController: boolean = false;
  isAutoPlay: boolean = false;
  audioReadyToPlay: boolean = false;
  fromLocalStorage: boolean = true;
  focusedBlock: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChild('comboLocation') comboLocation!: any;
  @ViewChild('creatorContent') creatorContent!: CpCreatorContentComponent;
  addedComboLocation = <any>{};
  provinces = <any>[];
  districts = <any>[];
  filteredDistricts = <any>[];
  calculatedTuanCuu = <any>[];
  wards = <any>[];
  filteredWards = <any>[];
  contentFormat = <any>{}
  fontSizeRange = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

  @HostListener('document:click', ['$event'])
  click(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if ([...event.target.classList].includes('form-control') && [...event.target.classList].includes('comboLocation')) {
        this.addedComboLocation = <any>{};
        this.addedComboLocation.title = event.target.getAttribute('aria-label')
        this.addedComboLocation.key = event.target.getAttribute('id')
        this.addedComboLocation.mode = event.target.classList.contains('PpDdWwA') ? 'PpDdWwA' : event.target.classList.contains('pPdDwWA') ? 'pPdDwWA' : ''
        const comboLocationRef = this.matDialog.open(this.comboLocation)
        this.filteredDistricts = <any>[];
        this.filteredWards = <any>[];
      }
    }
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private eRef: ElementRef,
    private matDialog: MatDialog,
    private locationService: LocationService,
    private commonService: CommonService
  ) {
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.isShowController = !state.matches && this.contentEditable;
      });
    this.audioTracking()
    this.getLocationSettings()
    const settingFontSize = localStorage.getItem('token')
    if (settingFontSize) {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(settingFontSize)
      this.contentFormat.fontSize = decodedToken?.fontSize || 18
    }
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

  getLocationSettings() {
    this.getAllDivisions()
    this.getDistricts()
    this.getWards()
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
      if (this.contentEditable) {
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
      }
      this.fromLocalStorage = false
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
      if (!this.contentEditable) {
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

  getAllDivisions() {
    this.provinces = this.locationService.provinces
    try {
      this.locationService.getAllDivisions()
        .subscribe((res: any) => {
          if (res?.length > 0) {
            this.provinces = res
            this.locationService.provinces = res
          }
        })
    } catch (e) {
      console.log(e);
    }
  }

  getDistricts() {
    this.districts = this.locationService.districts
    if (!this.districts || this.districts?.length === 0) {
      try {
        this.locationService.getDistricts()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.districts = res
              this.locationService.districts = res
              this.filteredDistricts = res?.filter((item: any) => item.province_code === this.addedComboLocation?.province)
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredDistricts = this.districts?.filter((item: any) => item.province_code === this.addedComboLocation.province)
      console.log(this.filteredDistricts);
    }
  }

  getWards() {
    this.wards = this.locationService.wards
    if (!this.wards || this.wards?.length === 0) {
      try {
        this.locationService.getWards()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.wards = res
              this.locationService.wards = res
              this.filteredWards = res?.filter((item: any) => item.district_code === this.addedComboLocation?.district)
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredWards = this.wards?.filter((item: any) => item.district_code === this.addedComboLocation.district)
    }
  }

  addComboLocation() {
    const comboLocation = document.getElementById(this.addedComboLocation.key)
    comboLocation?.setAttribute('value', JSON.stringify(this.addedComboLocation))
    if (comboLocation) {
      const province = this.provinces.find((item: any) => item.code === parseInt(this.addedComboLocation.province))
      const district = this.districts.find((item: any) => item.code === parseInt(this.addedComboLocation.district))
      const ward = this.wards.find((item: any) => item.code === parseInt(this.addedComboLocation.ward))
      const wardName = this.wards.find((item: any) => item.code === parseInt(this.addedComboLocation.ward))?.name?.replace('Phường', '')?.replace('Thị trấn', '')?.replace('Xã', '')
      switch (this.addedComboLocation.mode) {
        case 'PpDdWwA':
          this.addedComboLocation.text = `Việt Nam quốc, ${province ? province?.name?.replace('Thành phố', '')?.replace('Tỉnh', '') + ' ' +
            province?.division_type : ''
            }${district ? ', ' + district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', '') + ' ' +
              district?.division_type : ''
            }${ward ? ', ' + (parseInt(wardName) ? 'đệ ' + this.commonService.convertNumberToText(wardName) : wardName) + ' ' +
              ward?.division_type : ''
            }${this.addedComboLocation.village ? ', ' + this.addedComboLocation.village : ''}`.trim()
          break;
        case 'pPdDwWA':
          this.addedComboLocation.text = this.addedComboLocation.title
          break;
        default:
          break;
      }
      comboLocation.innerHTML = this.addedComboLocation.text
      this.creatorContent.updated = true
      this.creatorContent.onBlur()
    }
  }

  generaToken(data: any) {
    const base64url = (source: any) => {
      let encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }
    const header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token
  }

  updateFontSize() {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const token = localStorage.getItem('token')
    if (token) {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(token)
      decodedToken.fontSize = this.contentFormat?.fontSize
      if (users[decodedToken.userName]) {
        users[decodedToken.userName] = this.generaToken(decodedToken)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('token', JSON.stringify(this.generaToken(decodedToken)))
      }
    }
  }
}
