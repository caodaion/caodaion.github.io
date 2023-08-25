import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth/auth.service";
import { CommonService } from "../../shared/services/common/common.service";
import * as CryptoJS from "crypto-js";
import { NgTinyUrlService } from 'ng-tiny-url';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  qrData: any;
  caodaiTitle = CAODAI_TITLE.data
  roles = <any>[]
  colors = <any>[
    {
      key: 'thai',
      name: 'Thái',
      color: '#fbbc05'
    },
    {
      key: 'thuong',
      name: 'Thượng',
      color: '#4285f4'
    },
    {
      key: 'ngoc',
      name: 'Ngọc',
      color: '#ea4335'
    }
  ]
  isHolyNameRequired: boolean = false

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private tinyUrl: NgTinyUrlService
  ) {
  }

  ngOnInit() {
    const token = localStorage.getItem('token')
    if (token) {
      this.getCurrentUser()
      this.getRoles()
      this.updateUserProfile()
    } else {
    }
  }

  getRoles() {
    this.roles = []
    this.roles = this.caodaiTitle
      ?.find((item: any) => item.key === 'chuc-viec')?.subTitle
  }
  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser()
    console.log(this.currentUser);
    const qrData = `${location.href}?t=${this.generaToken(this.currentUser)}`
    if (qrData?.length >= 350) {
      try {
        this.tinyUrl.shorten(qrData)
          .subscribe((res: any) => {
            this.qrData = res;
          });
      } catch (e) {
        console.log(e)
      }
    } else {
      this.qrData = qrData
    }
    this.qrData = qrData
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
      link.download = this.commonService.generatedSlug(`caodaion-qr-${this.currentUser.userName}`)
      link.click()
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

  updateUserProfile() {
    this.isHolyNameRequired = this.caodaiTitle.find((item: any) => item.key === this.currentUser.title)?.isHolyNameRequired || false
    let selectedTitle: any = this.caodaiTitle.find((item: any) => item.key === this.currentUser.title);
    if (selectedTitle?.subTitle) {
      this.roles = selectedTitle?.subTitle
    }
    if (this.currentUser.name) {
      if (this.isHolyNameRequired) {
        if (this.currentUser.sex === 'male') {
          if (this.currentUser.color) {
            this.currentUser.holyName = `${this.colors.find((item: any) => item.key === this.currentUser.color)?.name} ${this.currentUser.name?.split(' ')[this.currentUser.name?.split(' ').length - 1]} Thanh`
          }
        }
        if (this.currentUser.sex === 'female') {
          this.currentUser.holyName = `Hương ${this.currentUser.name?.split(' ')[this.currentUser.name?.split(' ').length - 1]}`
        }
      }
    }
    let localStorageUsers = <any>{}
    localStorageUsers = JSON.parse(localStorage.getItem('users') || '{}')
    const userToken = this.generaToken(this.currentUser)
    localStorageUsers[this.currentUser.userName] = userToken
    localStorage.setItem('users', JSON.stringify(localStorageUsers))
    localStorage.setItem('token', JSON.stringify(userToken))
    this.getCurrentUser()
  }
}