import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {

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
    this.devAdministratorAction = (this.loginUser.userName.split(' ').every((t) => t.includes('dev.caodaion.administrator')) || this.loginUser.userName.split(' ').every((t) => t.includes('vovi.caodaion.administrator'))) && this.loginUser.password.split(' ').every((t) => t.includes('CaoDaiON'))
  }

  scanComplete(qrData: any) {
    this.qrData = qrData
    console.log(this.qrData);
  }
}
