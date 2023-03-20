import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  cols: number = 2;
  actionList = [
    {
      link: '/trang-chu/kinh',
      icon: 'menu_book',
      label: 'Đọc Kinh'
    },
    {
      link: '/trang-chu/thanh-ngon-hiep-tuyen',
      icon: 'auto_stories',
      label: 'Đọc Thánh Ngôn Hiệp Tuyển'
    },
    {
      link: '/trang-chu/thu-vien',
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
  ]
  constructor (
    private breakpointObserver: BreakpointObserver) {
      this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 2;
        } else {
          this.cols = 5;
        }
      });
  }
}
