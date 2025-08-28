import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MENU } from 'src/app/shared/constants/menu.constant';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  standalone: false
})
export class AppsComponent implements OnInit {
  allApps: any[] = [];
  featuredApps: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.buildAppsList();
    this.categorizeApps();
  }

  buildAppsList() {
    this.allApps = [
      {
        key: 'lich',
        url: '/lich',
        label: 'Lịch',
        icon: 'calendar_today',
        description: 'Xem lịch Cao Đài và các ngày lễ quan trọng',
      },
      {
        key: 'kinh',
        url: '/kinh',
        label: 'Kinh',
        icon: 'book',
        description: 'Đọc và tra cứu kinh cúng tứ thời và quan hôn tang tế',
      },
      {
        key: 'tinh-tuan-cuu',
        url: '/tinh-tuan-cuu',
        label: 'Tính tuần cửu',
        icon: 'calculate',
        description: 'Tính và quản lý Tuần Cửu',
      }
    ];
  }

  categorizeApps() {
    this.featuredApps = this.allApps;
  }

  onNavigateToApp(app: any) {
    this.router.navigate([app.url]);
  }
}
