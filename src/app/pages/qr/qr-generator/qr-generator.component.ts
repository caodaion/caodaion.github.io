import { Component } from '@angular/core';
import { CommonService } from "../../../shared/services/common/common.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NgTinyUrlService } from "ng-tiny-url";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent {
  qrData = location.href
  data = location.href
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  error = ''
  checkInError = ''
  checkInQRData = ''
  syncError = ''
  syncQRData = ''
  checkInTypes = [
    {
      key: 'tuGia',
      label: 'Tại tư gia cá nhân người dùng',
      disabled: false,
    },
    {
      key: 'church',
      label: 'Tại Thánh Thất/Thánh Tịnh/Cơ Quan Đạo/Nhà Tu, ...',
      disabled: true,
    },
    {
      key: 'tuGiaTinDo',
      label: 'Tại tư gia của một tín đồ',
      disabled: true,
    }
  ]
  checkInType: any = ''

  constructor(
    private tinyUrl: NgTinyUrlService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService
  ) {
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  saveAsImage(parent: any) {
    let parentElement = null
    parentElement = parent.qrcElement.nativeElement
      .querySelector("canvas")
      .toDataURL("image/png")
    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = this.commonService.generatedSlug('caodaion-qr')
      link.click()
    }
  }

  copyLink(data: any) {
    navigator.clipboard.writeText(data);
    this._snackBar.open('Đã sao chép liên kết', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onChangeData() {
    if (this.data?.length <= 350) {
      this.qrData = this.data
    } else {
      this.qrData = ''
      this.error = ''
      try {
        this.tinyUrl.shorten(this.data)
          .subscribe(res => {
            this.qrData = res;
          });
      } catch (e) {
        console.log(e)
        this.error = 'Khô thể tạo mã QR vì dữ liệu của bạn quá dài và không có kết nối mạng'
      }
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
    const signature = CryptoJS.HmacSHA512("myawesomedata", "mysecretkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token
  }

  generateCheckInQR() {
    let checkInData: any = null
    let checkInQrData = `${location?.origin}`
    if (this.checkInType == 'tuGia') {
      checkInQrData += `/trang-chu/hanh-trinh?t=tuGia`
    } else {
      checkInData = {
        t: this.checkInType
      }
      checkInQrData += `qr/quet-ma?token=${this.generaToken(checkInData)}`
    }
    if (checkInQrData?.length <= 350) {
      this.checkInQRData = checkInQrData
    } else {
      this.checkInQRData = ''
      this.checkInError = ''
      try {
        this.tinyUrl.shorten(checkInQrData)
          .subscribe(res => {
            this.checkInQRData = res;
          });
      } catch (e) {
        console.log(e)
        this.checkInError = 'Khô thể tạo mã QR vì dữ liệu của bạn quá dài và không có kết nối mạng'
      }
    }
  }

  generateSyncQR() {
    let syncData: any = null
    let syncQrData = `${location?.origin}/sync`
    // if (this.checkInType == 'tuGia') {
    //   syncQrData+=`?t=tuGia`
    // } else {
    //   syncData = {
    //     t: this.syncType
    //   }
    //   syncQrData+=`?token=${this.generaToken(syncData)}`
    // }
    console.log(syncQrData);

    if (syncQrData?.length <= 350) {
      this.syncQRData = syncQrData
    } else {
      this.syncQRData = ''
      this.syncError = ''
      try {
        this.tinyUrl.shorten(syncQrData)
          .subscribe(res => {
            this.syncQRData = res;
          });
      } catch (e) {
        console.log(e)
        this.syncError = 'Khô thể tạo mã QR vì dữ liệu của bạn quá dài và không có kết nối mạng'
      }
    }
  }
}
