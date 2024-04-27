import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CpCreatorContentComponent } from '../cp-creator-content/cp-creator-content.component';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'cp-content-creator',
  templateUrl: './cp-content-creator.component.html',
  styleUrls: ['./cp-content-creator.component.scss']
})
export class CpContentCreatorComponent implements OnChanges, AfterViewInit {
  [x: string]: any;
  @Input() data: any;
  @Input() topGuide?: any;
  @Input() rootContent: any;
  @Input() contentEditable: boolean = false;
  @Input() isShowFontSizeSelect: boolean = true;
  @Input() isShowController: any = undefined;
  @Output() save = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() nextContent = new EventEmitter();
  @Output() nextFontSize = new EventEmitter();
  isAutoPlay: boolean = false;
  audioReadyToPlay: boolean = false;
  fromLocalStorage: boolean = true;
  isShowCountry: boolean = false;
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
  fontSizeRange = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

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
        const openedData = JSON.parse(event.target.getAttribute('value') || '{}')
        this.addedComboLocation.country = 'Việt Nam'
        this.isShowCountry = false
        if (openedData?.country) {
          this.addedComboLocation.country = openedData?.country
          this.isShowCountry = true
        }
        if (openedData?.province) {
          this.addedComboLocation.province = openedData?.province
        }
        if (openedData?.district) {
          this.addedComboLocation.district = openedData?.district
        }
        if (openedData?.ward) {
          this.addedComboLocation.ward = openedData?.ward
        }
        if (openedData?.village) {
          this.addedComboLocation.village = openedData?.village
        }
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
    if (typeof this.isShowController === 'undefined') {
      this.isShowController = true
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
          this.isShowController = !state.matches && this.contentEditable;
        });
    }
    this.audioTracking()
    this.getLocationSettings()
    console.log(this.rootContent);

    if (this.data?.fontSize) {
      this.contentFormat.fontSize = this.data?.fontSize || 18
    } else {
      const settingFontSize = localStorage.getItem('token')
      if (settingFontSize) {
        const jwtHelper = new JwtHelperService()
        const decodedToken = jwtHelper.decodeToken(settingFontSize)
        this.contentFormat.fontSize = decodedToken?.fontSize || 18
      }
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
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
    }
  }

  addComboLocation() {
    const comboLocation = document.getElementById(this.addedComboLocation.key)
    comboLocation?.setAttribute('value', JSON.stringify(this.addedComboLocation))
    if (comboLocation) {
      const country = this.isShowCountry ? this.addedComboLocation.country : ''
      const province = this.provinces.find((item: any) => item.id == this.addedComboLocation.province)
      const district = this.districts.find((item: any) => item.id == this.addedComboLocation.district)
      const ward = this.wards.find((item: any) => item.id == this.addedComboLocation.ward)
      const wardName = this.wards.find((item: any) => item.id == this.addedComboLocation.ward)?.name?.replace('Phường', '')?.replace('Thị trấn', '')?.replace('Xã', '')
      switch (this.addedComboLocation.mode) {
        case 'PpDdWwA':
          this.addedComboLocation.text = `${country ? country + ' quốc,' : ''} ${province ? province?.name?.replace('Thành phố', '')?.replace('Tỉnh', '') + ' ' +
            (province?.name?.split(province?.name?.replace('Thành phố', '')?.replace('Tỉnh', ''))[0])?.toLowerCase() : ''
            }${district ? ', ' + district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', '') + ' ' +
              (district?.name?.split(district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', ''))[0])?.toLowerCase() : ''
            }${ward ? ', ' + (parseInt(wardName) ? 'đệ ' + this.commonService.convertNumberToText(wardName) : wardName) + ' ' +
              (ward?.level)?.toLowerCase() : ''
            }${this.addedComboLocation.village ? ', ' + this.addedComboLocation.village : ''}`.trim()
          break;
        case 'pPdDwWA':
          this.addedComboLocation.text = this.addedComboLocation.title
          break;
        default:
          break;
      }
      comboLocation.innerHTML = this.addedComboLocation.text
      const data = this.data.formGroup?.find((item: any) => item.key === this.addedComboLocation.key)
      if (data) {
        data.value = this.addedComboLocation
        this.onBlur()
        this.saveData()
      }
    }
    console.log(this.addedComboLocation);    
  }

  onBlur() {
    this.creatorContent.updated = true
    this.creatorContent.onBlur()
  }

  updateFontSize() {
    this.nextFontSize.emit(this.contentFormat?.fontSize)
  }


  onPrint() {
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      `<html><head>
      <title>${document.title.toUpperCase()}PRINTER</title>
      <style>
      .tableContent td, th {
        font-size: 22px;
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid #000000;
      }
      .btn-share-item {
        display: none;
      }
      .hide-print {
        display: none;
      }
      </style>
      `
    );
    printTab?.document.write('</head><body >');

    const printContent = document.getElementById('contentCreatorWrapper');
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      writeContent.innerHTML = `${printContent?.outerHTML}`;
      // @ts-ignore
      if (writeContent.childNodes[0] && writeContent.childNodes[0].style) {
        // @ts-ignore
        writeContent.childNodes[0].style.padding = 0;
      }
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }
}
