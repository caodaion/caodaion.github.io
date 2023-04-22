import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-update-journey',
  templateUrl: './update-journey.component.html',
  styleUrls: ['./update-journey.component.scss']
})
export class UpdateJourneyComponent {
  isShowQRScanner: boolean = false

  availableDevices: any;
  currentDevice: any;
  journeyLog = {
    type: '',
    timestamp: 0
  }

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: any;
  hasPermission: any;

  qrResultString: any;
  duplicateDialogRef: any;
  isContinueLog: boolean = false;
  @ViewChild('duplicateDialog') duplicateDialog!: any;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public matDialog: MatDialog
  ) {
    this.route.queryParams.subscribe((query) => {
      if (query['token']) {
        const token = query['token']
        const jwtHelper = new JwtHelperService()
        const decodedToken = jwtHelper.decodeToken(token)
        this.tokenAction(decodedToken)
      }
    })
  }


  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    const device = JSON.parse(localStorage.getItem('device') || '')
    if (device && device?.scanner) {
      this.currentDevice = device?.scanner
    }
    console.log(this.currentDevice);

  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.scanAction()
  }

  onDeviceSelectChange() {
    let device = {
      scanner: this.currentDevice
    }
    localStorage.setItem('device', JSON.stringify(device))
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
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
    console.log(this.qrResultString);

    if (this.qrResultString) {
      this.isShowQRScanner = false
      this._snackBar.open(`Đã quét được: ${this.qrResultString}`, 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })

      if (isValidUrl(this.qrResultString)) {
        if (this.qrResultString?.includes('hanh-trinh')) {
          console.log(getParameterByName('t', this.qrResultString));

          if (getParameterByName('t', this.qrResultString) == 'tuGia') {
            this.journeyLog.type = 'tuGia'
            this.checktuGiaJourney()
          }
        }
      }

    }
  }

  tokenAction(decodedToken: any) {
    if (decodedToken) {
      console.log(decodedToken);

    }
  }

  checktuGiaJourney() {
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

    const logJourney = () => {
      console.log('Continue');
      this.journeyLog.timestamp = Date.now()
      console.log(this.journeyLog);
      this.onCoutinue()
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
  }
}
