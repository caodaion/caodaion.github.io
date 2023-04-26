import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CHECKINEVENT, CHECKINTYPES } from 'src/app/shared/constants/master-data/check-in.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';

@Component({
  selector: 'app-update-journey',
  templateUrl: './update-journey.component.html',
  styleUrls: ['./update-journey.component.scss']
})
export class UpdateJourneyComponent implements AfterViewInit, OnInit {
  isShowQRScanner: boolean = false
  isStored: boolean = false
  qrData: any = ''
  removedJourneyMessage: any = ''
  journeyLog: JourneyLog = new JourneyLog()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  duplicateDialogRef: any;
  clearJourneyDialogRef: any;
  isContinueLog: boolean = false;
  isUpdateJourney: boolean = false;
  @ViewChild('duplicateDialog') duplicateDialog!: any;
  @ViewChild('clearJourney') clearJourney!: any;
  checkInTypes = CHECKINTYPES
  checkInEvents = CHECKINEVENT
  tuThoiType = <any>[];
  isShowLog: boolean = false;
  isShowDashboard: boolean = true;
  removedJourneyIndex: any = -1;
  addedMoreType: any;
  addedMoreLocation: any;

  constructor(
    private _snackBar: MatSnackBar,
    public matDialog: MatDialog,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.tuThoiType = TIME_TYPE?.data?.filter((item: any) => item?.key == 'ty-2301' || item?.key == 'meo-0507' || item?.key == 'ngo-1113' || item?.key == 'dau-1719')
  }

  ngOnInit(): void {
    this.mergeLocalstorageVariable()
  }

  mergeLocalstorageVariable() {
    const mergeLocation = () => {
      let localstorageLocation = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.location
      if (localstorageLocation && localstorageLocation?.length > 0) {
        this.checkInTypes = this.checkInTypes.concat(localstorageLocation.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    const mergeType = () => {
      let localstorageType = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.type
      if (localstorageType && localstorageType?.length > 0) {
        this.checkInEvents = this.checkInEvents.concat(localstorageType.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    mergeLocation()
    mergeType()
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((query) => {
      if (query['l']) {
        console.log(query['l']);
        this.isShowQRScanner = false
        this.onShowLog()
        this.journeyLog.location = query['l']
        let localstorageLocation = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.location
        if (!localstorageLocation?.find((item: any) => item === query['l'])) {
          this.journeyLog.location == 'addMore'
          this.addedMoreLocation = query['l']
        }
        this.journeyLog.method = 'Quét mã QR'
        this.checkTuGiaJourney()
      }
    })
    this.cd.detectChanges()
  }

  scanComplete(qrData: any) {
    this.qrData = qrData
    console.log(this.qrData);
    this.scanAction()
  }

  scanAction() {
    const isValidUrl = (string: any) => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }

    const getParameterByName = (name: any, url: any) => {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    console.log(this.qrData);

    if (this.qrData) {
      this._snackBar.open(`Đã quét được: ${this.qrData}`, 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })

      if (isValidUrl(this.qrData)) {
        this.isShowQRScanner = false
        if (this.qrData?.includes('hanh-trinh')) {
          console.log(getParameterByName('l', this.qrData));
          if (getParameterByName('l', this.qrData)) {
            this.journeyLog.location = getParameterByName('l', this.qrData)
            this.journeyLog.method = 'Quét mã QR'
            console.log(this.journeyLog);
            this.checkTuGiaJourney()
          }
        }
      } else {
        if (this.qrData?.split('|')?.length > 1) {
          // show a dialog to require checkout to the attendance tab
        }
      }
    }
  }

  tokenAction(decodedToken: any) {
    if (decodedToken) {
      console.log(decodedToken);
    }
  }

  checkTuGiaJourney() {
    let journeys = JSON.parse(localStorage.getItem('journey') || '[]')
    const startTy = new Date(new Date().setHours(23, 0, 0));
    const endTy = new Date(new Date().setHours(0, 59, 59));
    const startMeo = new Date(new Date().setHours(5, 0, 0));
    const endMeo = new Date(new Date().setHours(6, 59, 59));
    const startNgo = new Date(new Date().setHours(11, 0, 0));
    const endNgo = new Date(new Date().setHours(12, 59, 59));
    const startDau = new Date(new Date().setHours(17, 0, 0));
    const endDau = new Date(new Date().setHours(18, 59, 59));
    const newDate = new Date()
    this.isUpdateJourney = false
    const logJourney = () => {
      console.log('Continue');
      this.journeyLog.timestamp = Date.now()
      console.log(this.journeyLog);
      this.onCoutinue()
    }
    this.journeyLog.tuThoiType = ''
    if (
      !this.journeyLog.type && (
        newDate >= startTy && newDate <= endTy ||
        newDate >= startMeo && newDate <= endMeo ||
        newDate >= startNgo && newDate <= endNgo ||
        newDate >= startDau && newDate <= endDau)
    ) {
      this.journeyLog.type = 'cungTuThoi'
      if (newDate >= startTy && newDate <= endTy) {
        this.journeyLog.tuThoiType = 'ty-2301'
      }
      if (newDate >= startMeo && newDate <= endMeo) {
        this.journeyLog.tuThoiType = 'meo-0507'
      }
      if (newDate >= startNgo && newDate <= endNgo) {
        this.journeyLog.tuThoiType = 'ngo-1113'
      }
      if (newDate >= startDau && newDate <= endDau) {
        this.journeyLog.tuThoiType = 'dau-1719'
      }
    }
    if (
      !(journeys?.find((item: any) => new Date(item?.timestamp) >= startTy && new Date(item?.timestamp) <= endTy) ||
        journeys?.find((item: any) => new Date(item?.timestamp) >= startMeo && new Date(item?.timestamp) <= endMeo) ||
        journeys?.find((item: any) => new Date(item?.timestamp) >= startNgo && new Date(item?.timestamp) <= endNgo) ||
        journeys?.find((item: any) => new Date(item?.timestamp) >= startDau && new Date(item?.timestamp) <= endDau))
    ) {
      logJourney()
    } else {
      if (this.isContinueLog) {
        logJourney()
      } else {
        this.duplicateDialogRef = this.matDialog.open(this.duplicateDialog)
      }
    }
  }

  onCoutinue() {
    this.isContinueLog = true
    this.journeyLog.timestamp = Date.now()
    if (!this.journeyLog.method) {
      this.journeyLog.method = 'Thủ công'
    }
    this.journeyLog.device = navigator.userAgent.includes('Win') ? 'Máy tính' : navigator.userAgent.includes('Mobile') ? 'Điện thoại' : 'Chưa xác định'
  }

  storeJourney() {
    let journeys = JSON.parse(localStorage.getItem('journey') || '[]')
    this.isStored = true
    if (this.journeyLog.type == 'addMore' && this.addedMoreType) {
      this.journeyLog.type = this.addedMoreType
      let addedVariable = JSON.parse(localStorage.getItem('addedVariable') || 'null')
      if (!addedVariable) {
        addedVariable = {
          type: []
        }
      }
      if (!addedVariable?.type || !addedVariable?.type?.find((item: any) => item === this.addedMoreType)) {
        if (!addedVariable?.type || addedVariable?.type?.length == 0) {
          addedVariable.type = []
        }
        addedVariable?.type.push(this.addedMoreType)
        localStorage.setItem('addedVariable', JSON.stringify(addedVariable))
      }
    }
    if (this.journeyLog.location == 'addMore' && this.addedMoreLocation) {
      this.journeyLog.location = this.addedMoreLocation
      let addedVariable = JSON.parse(localStorage.getItem('addedVariable') || 'null')
      if (!addedVariable) {
        addedVariable = {
          location: []
        }
      }
      if (!addedVariable?.location || !addedVariable?.location?.find((item: any) => item === this.addedMoreLocation)) {
        if (!addedVariable?.location || addedVariable?.location?.length == 0) {
          addedVariable.location = []
        }
        addedVariable?.location.push(this.addedMoreLocation)
        localStorage.setItem('addedVariable', JSON.stringify(addedVariable))
      }
    }
    console.log(this.journeyLog);

    let foundJourney = journeys?.find((item: any) => item.timestamp === this.journeyLog.timestamp)
    const journeyIndex = journeys?.indexOf(foundJourney)
    if (foundJourney) {
      journeys[journeyIndex] = this.journeyLog
    } else {
      journeys.push(this.journeyLog)
    }
    localStorage.setItem('journey', JSON.stringify(journeys))
    this.onCancelLog()
  }

  onShowLog() {
    this.journeyLog = new JourneyLog()
    this.isShowLog = true
  }

  onCancelLog() {
    this.journeyLog = new JourneyLog()
    this.isStored = false
    this.isShowLog = false
    this.isContinueLog = false
    this.isShowDashboard = false
    setTimeout(() => {
      this.isShowDashboard = true
      this.route.queryParams.subscribe((query) => {
        if (query['l']) {
          this.router.navigate([], {})
        }
      })
    }, 0)
  }

  onClearJourney(item?: any) {
    this.removedJourneyIndex = -1
    if (item) {
      this.removedJourneyMessage = ''
      let journeys = JSON.parse(localStorage.getItem('journey') || '[]')
      this.journeyLog = item
      let foundJourney = journeys?.find((item: any) => item.timestamp === this.journeyLog.timestamp)
      const journeyIndex = journeys?.indexOf(foundJourney)
      if (item?.tuThoiType) {
        this.removedJourneyMessage += `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
      } else {
        this.removedJourneyMessage += CHECKINEVENT.find((cie: any) => cie.key == item.type)?.label || 'Chưa xác định'
      }
      this.removedJourneyMessage += ` tại ${CHECKINTYPES.find((cit: any) => cit.key == item.location)?.label || 'Chưa xác định'}`
      this.removedJourneyIndex = journeyIndex
    }
    this.clearJourneyDialogRef = this.matDialog.open(this.clearJourney)
  }

  onClearJourneyLocalStorage() {
    if (this.removedJourneyIndex !== -1) {
      let journeys = JSON.parse(localStorage.getItem('journey') || '[]')
      journeys.splice(this.removedJourneyIndex, 1)
      localStorage.setItem('journey', JSON.stringify(journeys))
    } else {
      localStorage.removeItem('journey')
    }
    this.onCancelLog()
  }

  validateJourney() {
    if (this.journeyLog.type === 'cungTuThoi') {
      return this.journeyLog.tuThoiType
    }
    return this.journeyLog.location && this.journeyLog.timestamp
  }

  onUpdateJourney(item: any) {
    this.onShowLog()
    const foundJourney = JSON.parse(localStorage.getItem('journey') || '[]')?.find((j: any) => j?.timestamp == item?.timestamp)
    this.journeyLog = foundJourney
    this.isShowQRScanner = false
    this.isContinueLog = true
    this.isUpdateJourney = true
    const subSidenavContent = document.getElementById('subSidenavContent')
    if (subSidenavContent) {
      subSidenavContent.scroll({ top: 0 })
    }
  }
}

export class JourneyLog {
  location: any;
  timestamp: any;
  type?: any;
  tuThoiType?: any;
  rating?: any;
  comment?: any;
  device?: any;
  method?: any;
}
