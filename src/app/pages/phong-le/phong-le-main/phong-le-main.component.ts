import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-phong-le-main',
  templateUrl: './phong-le-main.component.html',
  styleUrls: ['./phong-le-main.component.scss']
})
export class PhongLeMainComponent implements OnInit {

  isPhongLeAccessible: boolean = false
  currentUser: any;
  message: any;
  buttonSettings = <any>{};

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    if (this.currentUser) {
      if (this.currentUser.role.indexOf('phong-le') !== -1) {
        this.isPhongLeAccessible = true
      } else {
        this.isPhongLeAccessible = false
        this.message = 'Bạn cần cập nhật nhiệm vụ hành chánh có chứa PHÒNG LỄ trong cài đặt tài khoản thì mới được dùng tính năng này'
        this.buttonSettings.label = 'CẬP NHẬT NGAY'
        this.buttonSettings.link = `/@${this.currentUser.userName}`
      }
    } else {
      this.isPhongLeAccessible = false
      this.message = 'Bạn cần phải đăng nhập tài khoản có phân quyền PHÒNG LỄ mới được dùng tính năng này'
      this.buttonSettings.label = 'ĐĂNG NHẬP NGAY'
      this.buttonSettings.link = '/auth/dang-nhap'
    }
  }

}
