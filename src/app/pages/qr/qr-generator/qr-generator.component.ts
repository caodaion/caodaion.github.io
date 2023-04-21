import {Component} from '@angular/core';
import {CommonService} from "../../../shared/services/common/common.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {NgTinyUrlService} from "ng-tiny-url";

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
    return new Blob([uInt8Array], {type: imageType})
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
      const blob = new Blob([blobData], {type: "image/png"})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = this.commonService.generatedSlug('caodaion-qr')
      link.click()
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.qrData);
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
}
