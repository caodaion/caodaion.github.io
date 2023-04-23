import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-update-journey',
  templateUrl: './update-journey.component.html',
  styleUrls: ['./update-journey.component.scss']
})
export class UpdateJourneyComponent {
  isShowQRScanner: boolean = false
  qrData: any = ''
  journeyLog = {
    type: '',
    timestamp: 0
  }
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  duplicateDialogRef: any;
  isContinueLog: boolean = false;
  @ViewChild('duplicateDialog') duplicateDialog!: any;

  constructor(
    private _snackBar: MatSnackBar,
    public matDialog: MatDialog
  ) {
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
          console.log(getParameterByName('t', this.qrData));
          if (getParameterByName('t', this.qrData) == 'tuGia') {
            this.journeyLog.type = 'tuGia'
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

  storeJourney() {
    let journeys = JSON.parse(localStorage.getItem('journey') || '[]')
    journeys.push(this.journeyLog)
    console.log(journeys);
    localStorage.setItem('journey', JSON.stringify(journeys))
  }
}
