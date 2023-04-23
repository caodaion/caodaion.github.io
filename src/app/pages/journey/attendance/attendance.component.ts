import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { delay } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  qrData: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  duplicateDialogRef: any;
  journeyUser: any = null;
  attendanceList = <any>[]
  timeout = 3000
  @ViewChild('welcomeDialog') welcomeDialog!: any;
  welcomeDialogRef: any
  isDuplicate: boolean = true;

  constructor(
    private _snackBar: MatSnackBar,
    public matDialog: MatDialog,
    private cd: ChangeDetectorRef
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
    if (this.qrData) {
      this._snackBar.open(`Đã quét được: ${this.qrData}`, 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      if (this.qrData?.split('|')?.length > 1) {
        this.journeyUser = null
        const userData = this.qrData?.split('|')
        this.journeyUser = {
          id: userData[0],
          na: userData?.find((item: any) => item.includes('na='))?.replace('na=', ''),
          ti: userData?.find((item: any) => item.includes('ti='))?.replace('ti=', ''),
        }
        console.log(this.journeyUser);
        this.storeAttendance()
      } else {
        if (isValidUrl(this.qrData)) {
          // show a dialog to require checkout to the journey update tab
        }
      }
    }
  }

  storeAttendance() {
    this.welcomeDialogRef?.close();
    if (!this.attendanceList?.find((item: any) => item?.id === this.journeyUser?.id)) {
      this.isDuplicate = false
      this.attendanceList.push(this.journeyUser)
      this.cd.detectChanges()
      this.welcomeDialogRef?.close();
      this.welcomeDialogRef = this.matDialog.open(this.welcomeDialog)
      this.welcomeDialogRef?.afterOpened().subscribe(() => {
        setTimeout(() => {
          this.welcomeDialogRef?.close();
          this.welcomeDialogRef?.close();
          this.journeyUser = null
          console.log(this.attendanceList);
        }, this.timeout)
      })
    } else {
      this.welcomeDialogRef?.close();
      this.isDuplicate = true
      this.welcomeDialogRef = this.matDialog.open(this.welcomeDialog)
      this.welcomeDialogRef?.afterOpened().subscribe(() => {
        setTimeout(() => {
          this.welcomeDialogRef?.close();
          this.welcomeDialogRef?.close();
          this.journeyUser = null
        }, this.timeout)
      })
    }
  }
}
