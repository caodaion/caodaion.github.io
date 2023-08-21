import { Component, OnInit } from '@angular/core';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpUser = <any>{};
  caodaiTitle = CAODAI_TITLE.data
  roles = <any>[]
  submitted: boolean = false

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
    if (!this.signUpDisabled()) {
      let localStorageUsers = <any>{}
      localStorageUsers = JSON.parse(localStorage.getItem('users') || '{}')
      localStorageUsers[this.signUpUser.userName] = this.signUpUser
      localStorage.setItem('users', JSON.stringify(localStorageUsers))
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
}
