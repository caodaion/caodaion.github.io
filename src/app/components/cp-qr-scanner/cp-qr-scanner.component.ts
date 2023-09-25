import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { ScannerQRCodeConfig, ScannerQRCodeSelectedFiles, NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';

@Component({
  selector: 'cp-qr-scanner',
  templateUrl: './cp-qr-scanner.component.html',
  styleUrls: ['./cp-qr-scanner.component.scss']
})
export class CpQrScannerComponent implements AfterViewInit, OnDestroy {

  @Output() qrData = new EventEmitter<any>();

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    // fps: 1000,
    vibrate: 400,
    // isBeep: true,
    // decode: 'macintosh',
    // deviceActive: 0, // camera front: deviceActive=0  // back camera: deviceActive=1
    constraints: {
      // facingMode: "environment", // 'user' (front camera), and 'environment' (back camera).
      audio: false,
      video: {
        width: window.innerWidth // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      }
    }
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
  // @ts-ignore
  @ViewChild('action') action: NgxScannerQrcodeComponent;
  currentDevice: any;

  constructor(private qrcode: NgxScannerQrcodeService) { }

  ngAfterViewInit(): void {
    this.action.stop()
    this.action.isReady.pipe(delay(3000)).subscribe(() => {
      this.action.start();
    });
  }

  ngOnDestroy(): void {
    this.action.stop()
    console.log('destroy');
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    console.log(e);
    if (e[0]?.value) {
      this.qrData.emit(e[0].value)
      this.action.pause().pipe(delay(3000)).subscribe(() => {
        this.action.play()
      })
    }
  }

  public handle(action: NgxScannerQrcodeComponent, fn: string): void {
    // @ts-ignore
    action[fn]().subscribe(console.log, alert);
  }
}
