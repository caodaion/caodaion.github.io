import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  cols: number = 2;
  actionList = [
    {
      link: '/kinh',
      icon: 'menu_book',
      label: 'Các bài Kinh'
    },
    {
      link: '/thanh-ngon-hiep-tuyen',
      icon: 'auto_stories',
      label: 'Thánh Ngôn Hiệp Tuyển'
    },
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
    {
      link: '/caodai100',
      icon: 'money',
      label: '100'
    },
  ]

  constructor (
    private breakpointObserver: BreakpointObserver
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
}
