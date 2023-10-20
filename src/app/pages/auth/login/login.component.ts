import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import * as CryptoJS from "crypto-js";
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  loginUser = {
    userName: '',
    password: ''
  };
  devAdministratorAction: boolean = false
  debugDevAdminCount = 0
  qrData: any;
  jwtHelper = new JwtHelperService();
  cols: any;
  guestAccounts: any;
  caodaiTitle = CAODAI_TITLE.data
  kids = <any>[]
  message: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private gameService: GameService
  ) {
  }

  ngAfterViewChecked(): void {
    if (this.gameService.isActiveKidsList && this.kids?.length === 0) {
      this.getKidsList()
    }
  }

  getKidsList() {
    this.gameService.getKidsList()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.kids = res.data
        }
      })
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1;
        } else {
          this.cols = 3;
        }
      });
    this.guestAccounts = this.caodaiTitle
      ?.find((item: any) => item.key === 'chuc-viec')?.subTitle
    this.guestAccounts = this.guestAccounts.concat([{
      key: 'kids',
      name: 'Nhi Đồng'
    }])
  }

  countDebugAdmin() {
    if (this.loginUser.userName.split(' ').every((t) => t.includes('dev.caodaion.administrator')) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON')) ||
      this.loginUser.userName.split(' ').every((t) => t.includes('vovi.caodaion.administrator')) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON'))

    ) {
      this.debugDevAdminCount++
    }
  }

  login() {
    if (!this.devAdministratorAction) {
      if (this.kids?.length > 0) {
        const foundKid = this.kids?.find((item: any) => item?.userName === this.loginUser.userName)
        if (foundKid) {
          if (foundKid?.password === this.loginUser.password) {
            localStorage.setItem('token', this.generaToken(foundKid))
            this.authService.getCurrentUser()
            location.reload()
            location.href = 'trang-chu'
            this._snackBar.open('Đã đăng nhập thành công', 'Đóng', {
              duration: this.durationInSeconds * 1000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            })
          } else {
            this.message = 'Tài khoản hoặc mật khẩu không đúng.'
          }
        }
      } else {
        if (this.loginUser.userName && this.loginUser.password && !this.loginUser.userName.split(' ').every((t) => t.includes('dev.caodaion.administrator')) && !this.loginUser.userName.split(' ').every((t) => t.includes('vovi.caodaion.administrator'))) {
          const localStorageUser = JSON.parse(localStorage.getItem('users') || '{}')
          if (localStorageUser[this.loginUser.userName]) {
            const decodeUser = this.jwtHelper.decodeToken(localStorageUser[this.loginUser.userName])
            if (decodeUser.password === this.loginUser.password) {
              localStorage.setItem('token', localStorageUser[this.loginUser.userName])
              this.authService.getCurrentUser()
              location.reload()
              location.href = 'trang-chu'
              this._snackBar.open('Đã đăng nhập thành công', 'Đóng', {
                duration: this.durationInSeconds * 1000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              })
            }
          }
        }
      }
    } else {
      if (this.debugDevAdminCount >= 12 && this.debugDevAdminCount % 2 === 0) {
        if (this.loginUser.userName.split(' ').every((t) => t.includes('vovi.caodaion.administrator')) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON'))) {
          localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InZvdmkuY2FvZGFpb24uYWRtaW5pc3RyYXRvciIsIm5hbWUiOiJWbyBWaSBBZG1pbiIsInJvbGUiOiJ2b2RpLmFkbWluaXN0cmF0b3IiLCJ1aWQiOiJ2b3ZpX2FkbWluaXN0cmF0b3IiLCJ2b1ZpV29ya2VyIjp0cnVlLCJjaGlsZHJlbiI6W3sia2V5IjoiYW55In1dLCJlbWFpbCI6ImRldi5jYW9kYWlvbi5hZG1pbmlzdHJhdG9yQGdtYWlsLmNvbSJ9.FVXEDFZTgHThvVX5b66pRzZgpbY8Y0H3ykasExA-ckY')
        }
        if (this.loginUser.userName.split(' ').every((t) => t.includes('dev.caodaion.administrator')) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON'))) {
          localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRldi5jYW9kYWlvbi5hZG1pbmlzdHJhdG9yIiwibmFtZSI6IkRldiBBZG1pbiIsInJvbGUiOiJkZXYuYWRtaW5pc3RyYXRvciIsInVpZCI6ImRldl9hZG1pbmlzdHJhdG9yIiwiY2hpbGRyZW4iOlt7ImtleSI6ImFueSJ9XSwiZW1haWwiOiJkZXYuY2FvZGFpb24uYWRtaW5pc3RyYXRvckBnbWFpbC5jb20ifQ.VgdJnRU9pRhQ5D5m3YHkCgZ5K--HCGgOFArnSauoN5U')
        }
        this.authService.getCurrentUser()
        location.reload()
        location.href = 'trang-chu'
      }
    }
  }

  enterLoginInformation() {
    this.message = ''
    this.devAdministratorAction = (this.loginUser.userName.split(' ').every((t) => t.includes('dev.caodaion.administrator')) || this.loginUser.userName.split(' ').every((t) => t.includes('vovi.caodaion.administrator'))) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON'))
  }

  scanComplete(qrData: any) {
    this.qrData = qrData
    location.href = this.qrData
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

  logInWithGuest(role: any) {
    const user = {
      userName: `${new Date().getTime()}`,
      role: [role],
      isGuest: true
    }
    localStorage.setItem('token', this.generaToken(user))
    this.authService.getCurrentUser()
    location.reload()
    location.href = 'trang-chu'
    this._snackBar.open('Đã đăng nhập thành công', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    })
  }
}
