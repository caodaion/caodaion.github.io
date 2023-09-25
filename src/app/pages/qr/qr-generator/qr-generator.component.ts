import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../../shared/services/common/common.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as CryptoJS from 'crypto-js';
import { CHECKINTYPES } from 'src/app/shared/constants/master-data/check-in.constant';
import { SYNCTYPES } from 'src/app/shared/constants/master-data/sync.constant';
import { TinyUrlService } from 'src/app/shared/services/tiny-url.service';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent implements OnInit {
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
  checkInTypes = CHECKINTYPES
  checkInType: any = ''
  syncTypes = SYNCTYPES;
  syncType: any;
  loadingData: boolean = false;
  selectedIndex: any;
  addedMoreLocation: any;

  constructor(
    private tinyUrlService: TinyUrlService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    if (!!window.history.state.selectedIndex) {
      this.selectedIndex = parseInt(window.history.state.selectedIndex)
    }
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
    mergeLocation()
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
      link.download = this.commonService.generatedSlug(`caodaion-qr-${this.selectedIndex === 0 ? '0' : this.selectedIndex === 1 ? ('checkin-' + this.addedMoreLocation || this.checkInType) : this.selectedIndex === 2 ? 'sync' : ''}`)
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
        this.loadingData = true
        this.tinyUrlService.shortenUrl(this.data)
          .subscribe((res: any) => {
            this.qrData = res?.data?.tiny_url;
            this.loadingData = false
          });
      } catch (e) {
        console.log(e)
        this.loadingData = false
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
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token
  }

  generateCheckInQR() {
    let checkInData: any = null
    let checkInQrData = `${location?.origin}`
    if (this.checkInType == 'addMore' && this.addedMoreLocation) {
      checkInQrData += `/trang-chu/hanh-trinh?l=${this.generaToken(this.addedMoreLocation)}`
    } else {
      if (this.checkInType == 'tuGia') {
        checkInQrData += `/trang-chu/hanh-trinh?l=${this.checkInType}`
      } else {
        checkInQrData += `/trang-chu/hanh-trinh?l=${this.generaToken(this.checkInType)}`
      }
    }
    if (checkInQrData?.length <= 350) {
      this.checkInQRData = checkInQrData
    } else {
      this.checkInQRData = ''
      this.checkInError = ''
      try {
        this.loadingData = true
        this.tinyUrlService.shortenUrl(checkInQrData)
          .subscribe((res: any) => {
            this.loadingData = false
            this.checkInQRData = res?.data?.tiny_url;
          });
      } catch (e) {
        this.loadingData = false
        console.log(e)
        this.checkInError = 'Khô thể tạo mã QR vì dữ liệu của bạn quá dài và không có kết nối mạng'
      }
    }
  }

  generateSyncQR() {
    let syncData: any = null
    let syncQrData = `${location?.origin}/tac-vu/sync`
    this.syncError = ''
    if (this.syncType == 'journey') {
      const localStorageJourney = localStorage.getItem('journey')
      if (JSON.parse(localStorageJourney || '[]')?.length > 0) {
        const syncObject = {
          type: 'journey',
          data: localStorageJourney
        }
        const token = this.generaToken(syncObject)
        syncQrData += `?token=${token}`
      } else {
        this.syncError = 'Sổ tay hành trình chưa có ghi dấu nào cả.'
      }
    } else {
      syncData = {
        t: this.syncType
      }
      syncQrData += `?token=${this.generaToken(syncData)}`
    }
    console.log(syncQrData);

    if (syncQrData?.length <= 350) {
      this.syncQRData = syncQrData
    } else {
      this.syncQRData = ''
      this.syncError = ''
      try {
        this.loadingData = true;
        this.tinyUrlService.shortenUrl(syncQrData)
          .subscribe((res: any) => {
            this.syncQRData = res?.data?.tiny_url;
            this.loadingData = false;
          });
      } catch (e) {
        console.log(e)
        this.loadingData = false;
        this.syncError = 'Khô thể tạo mã QR vì dữ liệu của bạn quá dài và không có kết nối mạng'
      }
    }
  }

  selectedTabChange(event: any) {
    this.selectedIndex = event.index
  }
}
