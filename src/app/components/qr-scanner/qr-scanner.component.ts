import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

@Component({
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.component.html',
    styleUrls: ['./qr-scanner.component.scss'],
    standalone: false
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
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
    
    // Try to get the last used device from localStorage
    try {
      const lastDeviceData = localStorage.getItem('lastDevice');
      if (lastDeviceData) {
        const device = JSON.parse(lastDeviceData);
        if (device && device?.scanner) {
          // Check if the stored device still exists in available devices
          const foundDevice = devices.find(d => d.deviceId === device.scanner.deviceId);
          if (foundDevice) {
            this.currentDevice = foundDevice;
          } else {
            // If stored device not found, use the last available device
            this.currentDevice = devices[devices.length - 1];
          }
        } else {
          // If no valid stored device, use the last available device
          this.currentDevice = devices[devices.length - 1];
        }
      } else {
        // If no stored device, use the last available device
        this.currentDevice = devices[devices.length - 1];
      }
    } catch (error) {
      console.warn('Error parsing stored device data:', error);
      // Fallback to last available device
      this.currentDevice = devices[devices.length - 1];
    }
    
    console.log('Selected device:', this.currentDevice);
  }

  scanComplete(resultString: string) {
    this.qrResultString = resultString;
    this.scanAction()
  }

  onDeviceSelectChange() {
    if (this.currentDevice) {
      let device = {
        scanner: this.currentDevice
      }
      localStorage.setItem('lastDevice', JSON.stringify(device))
      console.log('Device saved to localStorage:', device);
    }
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
      this._snackBar.open(`Đã quét được: ${this.qrResultString}`, 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })

      if (isValidUrl(this.qrResultString)) {
        setTimeout(() => {
          location.href = this.qrResultString
        }, 500)
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
