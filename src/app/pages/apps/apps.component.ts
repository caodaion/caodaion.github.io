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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.buildAppsList();
  }

  buildAppsList() {
    this.allApps = [];
    
    // Add main menu items and their children
    MENU?.filter((item: any) => item?.released && item?.fullAssess).forEach(menuItem => {
      if (menuItem.released && menuItem.key !== 'apps') { // Exclude the apps itself to avoid recursion
        // Add main item
        this.allApps.push({
          key: menuItem.key,
          url: menuItem.url,
          label: menuItem.label,
          icon: menuItem.icon,
          description: `Truy cập ${menuItem.label}`,
          category: 'Tính năng chính'
        });

        // Add children if they exist
        if (menuItem.children) {
          menuItem.children?.filter((item: any) => item?.released && item?.fullAssess).forEach(child => {
            if (child.released) {
              this.allApps.push({
                key: child.key,
                url: child.url,
                label: child.label,
                icon: child.icon,
                description: `${menuItem.label} - ${child.label}`,
                category: menuItem.label
              });
            }
          });
        }
      }
    });

    // Add additional standalone features
    this.allApps.push(
      {
        key: 'maps',
        url: 'maps',
        label: 'Bản đồ',
        icon: 'map',
        description: 'Xem bản đồ các thánh sở Cao Đài trên toàn quốc',
        category: 'Tiện ích'
      },
      {
        key: 'qr-scanner',
        url: 'qr',
        label: 'Quét mã QR',
        icon: 'qr_code_scanner',
        description: 'Quét và tạo mã QR',
        category: 'Tiện ích'
      },
      {
        key: 'settings',
        url: 'cai-dat',
        label: 'Cài đặt',
        icon: 'settings',
        description: 'Cài đặt và tùy chỉnh ứng dụng',
        category: 'Hệ thống'
      }
    );
  }

  onNavigateToApp(app: any) {
    this.router.navigate([app.url]);
  }

  getAppsByCategory(category: string) {
    return this.allApps.filter(app => app.category === category);
  }

  getCategories() {
    const categories = [...new Set(this.allApps.map(app => app.category))];
    // Define the preferred order for categories
    const categoryOrder = [
      'Tính năng chính',
      'Trang chủ',
      'Lịch',
      'Tác vụ',
      'Tâm linh',
      'Tiện ích',
      'Giải trí',
      'Hệ thống'
    ];
    
    return categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }
}
