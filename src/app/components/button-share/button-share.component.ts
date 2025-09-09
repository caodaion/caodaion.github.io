import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import * as QRCode from 'qrcode'

@Component({
    selector: 'button-share',
    templateUrl: './button-share.component.html',
    styleUrls: ['./button-share.component.scss'],
    standalone: false
})
export class ButtonShareComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Input() title?: any
  @Input() url?: any = ``
  shareBottomSheetRef: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  @ViewChild('shareBottomSheet') shareBottomSheet!: any;
  sharedUrl: any = ''
  qrSharedUrl: any = ''

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (this.eRef) {
      if (this.eRef.nativeElement.contains(event.target)) {
        this.shareBottomSheetRef = this.matBottomSheet.open(this.shareBottomSheet)
      }
    }
  }

  constructor(
    private _snackBar: MatSnackBar,
    private matBottomSheet: MatBottomSheet,
    private eRef: ElementRef,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.sharedUrl = `${window.location.href}`
    this.router.events.subscribe((val: any) => {      
      this.sharedUrl = `${window.location.origin}${val.url || window.location.pathname}`
      QRCode.toDataURL(this.sharedUrl)
        .then(url => {
          this.qrSharedUrl = url;        
        })
        .catch(err => {
          console.error(err);
        });
    })
    if (this.url) {
      this.sharedUrl = this.url
      QRCode.toDataURL(this.sharedUrl)
        .then(url => {
          this.qrSharedUrl = url;        
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  ngAfterViewChecked(): void {    
    if (this.url) {
      this.sharedUrl = this.url
    }
  }

  ngAfterViewInit(): void {
    if (this.url) {
      this.sharedUrl = this.url
    }
    QRCode.toDataURL(this.sharedUrl)
      .then(url => {
        this.qrSharedUrl = url;        
      })
      .catch(err => {
        console.error(err);
      });
  }

  copyLink() {
    navigator.clipboard.writeText(this.sharedUrl);
    this.shareBottomSheetRef.dismiss()
    this._snackBar.open('Đã sao chép liên kết', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  shareTo(to: any) {
    switch (to) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.sharedUrl)}`)
        break;
      default:
        this.copyLink()
        break;
    }
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
    parentElement = this.qrSharedUrl
    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = this.commonService.generatedSlug(this.title || 'caodaion-qr')
      link.click()
    }
  }
}
