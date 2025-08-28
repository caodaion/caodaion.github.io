import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, IconComponent],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss'
})
export class AppsComponent {
  apps: App[] = [
    {
      id: 'calendar',
      name: 'Lịch',
      description: 'Xem lịch Cao Đài và các ngày lễ quan trọng',
      icon: 'calendar_today',
      route: '/lich'
    },
    {
      id: 'tuan-cuu',
      name: 'Tuần Cửu',
      description: 'Tính và quản lý Tuần Cửu',
      icon: 'date_range',
      route: '/tuan-cuu'
    },
    // {
    //   id: 'lanh',
    //   name: 'Lành',
    //   description: 'Theo dõi và quản lý các hoạt động lành hàng ngày',
    //   icon: 'favorite',
    //   route: '/lanh'
    // },
    {
      id: 'kinh',
      name: 'Kinh',
      description: 'Đọc và tra cứu kinh sách Cao Đài',
      icon: 'book',
      route: '/kinh'
    },
    // {
    //   id: 'tnht',
    //   name: 'TNHT',
    //   description: 'Thánh Ngôn Hiệp Tuyển',
    //   icon: 'auto_stories',
    //   route: '/tnht'
    // },
    // {
    //   id: 'docs',
    //   name: 'Soạn thảo',
    //   description: 'Soạn thảo và quản lý văn bản với trình soạn thảo nâng cao',
    //   icon: 'description',
    //   route: '/docs'
    // },
  ];
}
