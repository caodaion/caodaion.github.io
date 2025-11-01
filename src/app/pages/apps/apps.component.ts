import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { EventSignService } from 'src/app/shared/services/event-sign.service';
import { MatMenuModule } from '@angular/material/menu';
import { AppTourMenu } from "src/app/components/app-tour-menu/app-tour-menu";

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
  imports: [CommonModule, RouterModule, IconComponent, MatMenuModule, AppTourMenu],
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
      description: 'Đọc và tra cứu kinh cúng tứ thời và quan hôn tang tế',
      icon: 'book',
      route: '/kinh'
    },
    {
      id: 'hoc',
      name: 'Học',
      description: 'Học tập về đạo Cao Đài qua các bài học tương tác',
      icon: 'school',
      route: '/hoc'
    },
    {
      id: 'maps',
      name: 'Bản đồ',
      description: 'Tìm kiếm và định vị các thánh thất, điểm tâm linh Cao Đài',
      icon: 'globe_location_pin',
      route: '/maps'
    },
    {
      id: 'weather',
      name: 'Thời tiết',
      description: 'Xem dự báo thời tiết hiện tại và 7 ngày tới',
      icon: 'partly_cloudy_day',
      route: '/weather'
    },
    {
      id: 'blogger',
      name: 'Blog',
      description: 'Đọc các bài viết về đạo Cao Đài từ CaoDaiON Blog',
      icon: 'article',
      route: '/blog'
    },
    {
      id: 'editor',
      name: 'Soạn thảo',
      description: 'Soạn thảo và quản lý văn bản với trình soạn thảo nâng cao',
      icon: 'edit_note',
      route: '/docs'
    },
    // {
    //   id: 'ca-nhan',
    //   name: 'Cá Nhân',
    //   description: 'Tự theo dõi hành trình mỗi ngày',
    //   icon: 'self_improvement',
    //   route: '/ca-nhan'
    // },
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
  eventSigns: any[] = [];

  constructor(
    private eventSignService: EventSignService
  ) {
    this.eventSigns = this.eventSignService.getEventSigns();
  }
}
