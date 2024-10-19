import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  cols: number = 2;
  actionList = [
    {
      link: '/kinh',
      icon: 'menu_book',
      label: 'Các bài Kinh'
    },
    // {
    //   link: '/thanh-ngon-hiep-tuyen',
    //   icon: 'auto_stories',
    //   label: 'Thánh Ngôn Hiệp Tuyển'
    // },
    {
      link: '/thu-vien',
      icon: 'library_books',
      label: 'Xem thư viện'
    },
    {
      link: '/lich',
      icon: 'today',
      label: 'Xem Lịch'
    },
    {
      link: '/lich/tinh-tuan-cuu',
      icon: 'calculate',
      label: 'Tính tuần cửu'
    },
    {
      link: '/tac-vu/phong-le',
      icon: 'receipt_long',
      label: 'Soạn sớ'
    },
    {
      link: '/tac-vu/hanh-le',
      icon: 'receipt_long',
      label: 'Hành Lễ'
    },
    // {
    //   link: '/100',
    //   icon: 'money',
    //   label: '100'
    // },
    {
      link: '/caodai100',
      icon: 'money',
      label: '100'
    },
  ]

  isShowDienThoPhatMau: boolean = false

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 2;
        } else {
          this.cols = 8;
        }
      });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .subscribe({
        next: (res: any) => {
          if (res?.userName === 'nhannt98' || res?.userName === 'annt90') {
            this.isShowDienThoPhatMau = true
          } else {
            this.isShowDienThoPhatMau = false
          }
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('completed');
        },
      })
  }
}
