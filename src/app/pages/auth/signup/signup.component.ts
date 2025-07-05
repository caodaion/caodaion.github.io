import {Component, OnInit} from '@angular/core';
import {CAODAI_TITLE} from 'src/app/shared/constants/master-data/caodai-title.constant';
import {AuthService} from 'src/app/shared/services/auth/auth.service';
import * as CryptoJS from "crypto-js";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: false
})
export class SignupComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  signUpUser = <any>{};
  caodaiTitle = CAODAI_TITLE.data
  roles = <any>[]
  submitted: boolean = false
  userNameHasBeenUsed: boolean = false

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {

  }


  ngOnInit(): void {
    this.getRoles()
  }

  getRoles() {
    this.roles = []
    if (this.signUpUser.title !== 'chuc-viec') {
      this.roles = this.caodaiTitle
        ?.find((item: any) => item.key === 'chuc-viec')?.subTitle
        ?.filter((item: any) => !item.isChucViecRequired)
        ?.map((item: any) => {
          return {
            key: item.key,
            name: item.name.includes('Phó Quản Lý') ? item.name?.replace('Phó Quản Lý', '') : item.name,
          }
        })
    } else {
      this.roles = this.caodaiTitle
        ?.find((item: any) => item.key === 'chuc-viec')?.subTitle
    }
  }

  singUp() {
    this.submitted = true
    this.userNameHasBeenUsed = false
    if (!this.signUpDisabled()) {
      let localStorageUsers = <any>{}
      localStorageUsers = JSON.parse(localStorage.getItem('users') || '{}')
      if (localStorageUsers[this.signUpUser.userName]) {
        this.userNameHasBeenUsed = true
      } else {
        const userToken = this.generaToken(this.signUpUser)
        localStorageUsers[this.signUpUser.userName] = userToken
        localStorage.setItem('users', JSON.stringify(localStorageUsers))
        localStorage.setItem('token', userToken)
        this.authService.getCurrentUser(true).subscribe((res: any) => {
          console.log(res);          
          localStorage.setItem('token', this.generaToken(res))
          this._snackBar.open('Đã đăng ký thành công', 'Đóng', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          }).afterOpened().subscribe(() => {
            location.reload()
            location.href = ''
          })
        })
      }
    }
  }

  signUpDisabled() {
    if (!this.signUpUser.userName || !this.signUpUser.password || !this.signUpUser.confirmPassword) {
      return true
    }
    if (this.signUpUser.title === 'chuc-viec' && !this.signUpUser.role) {
      return true
    }
    return false
  }

  updateSignUpInfo() {
    this.submitted = false
  }

  blockNotAllowKeys(event: any, notAllowedKeys: any) {
    return !notAllowedKeys?.includes(event?.key)
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
}
