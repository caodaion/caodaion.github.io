import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../../shared/services/common/common.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as CryptoJS from 'crypto-js';
import { CHECKINTYPES } from 'src/app/shared/constants/master-data/check-in.constant';
import { SYNCTYPES } from 'src/app/shared/constants/master-data/sync.constant';
import { TinyUrlService } from 'src/app/shared/services/tiny-url/tiny-url.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

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
  minimalList: boolean = false;
  isExisting: boolean = false;
  caodaionAd: boolean = true;
  selectedIndex: any;
  addedMoreLocation: any;
  setting: any;
  shorts = <any>[];

  constructor(
    private tinyUrlService: TinyUrlService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    private captureService: NgxCaptureService
  ) {
  }

  ngOnInit(): void {
    if (!!window.history.state.selectedIndex) {
      this.selectedIndex = parseInt(window.history.state.selectedIndex)
    }
    this.mergeLocalstorageVariable()
    if (!this.setting?.googleForms && !this.setting?.id && !this.setting?.data) {      
      this.getShortLinkSetting()
    }
  }

  getShortLinkSetting() {
    const convertData = () => {
      this.isExisting = false
      const foundshort = this.shorts?.find((item: any) => item?.data == this.data)
      if (foundshort) {
        this.qrData = `${location.origin}/qr/${foundshort?.id}`
        this.isExisting = true
      } else {
        const id = `${Date.now()}`
        this.qrData = `${location.origin}/qr/${id}`
        if (this.setting?.googleForms && this.setting?.id && this.setting?.data) {
          if (this.setting?.googleForms) {
            if (this.setting?.googleForms?.includes('http')) {
              this.setting.googleForms = this.setting?.googleForms?.split('e/')[1]?.split('/')[0]
            }
          }
          this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleForms}/viewform?${this.setting?.id}=${id}&${this.setting?.data}=${encodeURIComponent(this.data)}`
        }
      }
    }
    if (this.minimalList && this.setting?.googleForms && this.setting?.id && this.setting?.data) {
      convertData()
    } else {      
      this.tinyUrlService.fetchShort()?.subscribe((res: any) => {
        if (res.code === 200) {
          this.setting = res.data?.setting
          this.shorts = res.data?.data          
          if (this.minimalList && this.setting?.googleForms && this.setting?.id && this.setting?.data) {
            convertData()
          }
        }
      })
    }
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
  downloading = false
  saveAsImage(element: any) {
    setTimeout(() => {
      this.downloading = true
      const saveItem = document.getElementById(element?.id)
      this.captureService
        //@ts-ignore
        .getImage(saveItem, true)
        .pipe(
          tap((img: string) => {
            // converts base 64 encoded image to blobData
            let blobData = this.convertBase64ToBlob(img)
            // saves as image
            const blob = new Blob([blobData], { type: "image/png" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            // name of the file            
            link.download = `${element?.id?.toString()?.replace('.', '_')}`
            link.click()
            this.downloading = false
          })
        )
        .subscribe();
    }, 0)
  }

  copyLink(data: any) {
    navigator.clipboard.writeText(data);
    this._snackBar.open('Đã sao chép liên kết', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  googleFormsPath: any;
  onChangeData() {
    this.googleFormsPath = ''
    if (this.minimalList) {
      this.caodaionAd = true
      this.getShortLinkSetting()
    } else {
      if (this.data.includes(location.origin)) {
        this.qrData = this.data
      } else {
        if (this.caodaionAd) {
          this.qrData = `${location.origin}/qr/${this.generaToken(JSON.parse(JSON.stringify(this.data)))}`
        } else {
          this.minimalList = false
          this.qrData = this.data
        }
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
      checkInQrData += `/hanh-trinh?l=${this.generaToken(this.addedMoreLocation)}`
    } else {
      if (this.checkInType == 'tuGia') {
        checkInQrData += `/hanh-trinh?l=${this.checkInType}`
      } else {
        checkInQrData += `/hanh-trinh?l=${this.generaToken(this.checkInType)}`
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
