import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {

  availableDevices: any;
  currentDevice: any;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: any;
  hasPermission: any;

  qrResultString: any;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    route.queryParams.subscribe((query) => {
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
    console.log(this.qrResultString);

    if (this.qrResultString) {
      this._snackBar.open(`Đã quét được: ${this.qrResultString}`)

      if (isValidUrl(this.qrResultString)) {
        location.href = this.qrResultString
      }
    }
  }

  tokenAction(decodedToken: any) {
    if (decodedToken) {
      if (decodedToken.action) {
        if (decodedToken.action === 'checkIn') {
          console.log(decodedToken);
        }
        if (decodedToken.action === 'redirect') {
          console.log(decodedToken);
        }
        if (decodedToken.action === 'sync') {
          console.log(decodedToken);
        }
      }
    }
  }
}
