import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AppTour {
  private readonly tourService = inject(TourService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly navigationService = inject(NavigationService);
  private readonly nextButtonLabel = this.breakpointObserver.isMatched('(max-width: 600px)') ? 'Tiếp' : 'Tiếp theo';
  private readonly prevButtonLabel = this.breakpointObserver.isMatched('(max-width: 600px)') ? 'Trước' : 'Trước đó';
  private readonly endButtonLabel = 'Kết thúc';
  private defaultStepSetting = {
    nextBtnTitle: this.nextButtonLabel,
    prevBtnTitle: this.prevButtonLabel,
    endBtnTitle: this.endButtonLabel,
    enableBackdrop: true,
  }

  constructor() {
    this.tourService.stepShow$.subscribe((step: any) => {
      if (step?.step?.anchorId === 'side.mobile-subnav-toggle') {
        switch (location.pathname.split('/')[1]) {
          case 'lich':
            this.navigationService.setCalendarNavVisibility(true);
            break;
          default:
            break;
        }
      }
    });
    this.tourService.stepHide$.subscribe((step: any) => {
      const lastStep: any = this.tourService.steps[this.tourService.steps.length - 1];
      if (step?.step?.anchorId === lastStep?.anchorId) {
        switch (location.pathname.split('/')[1]) {
          case 'lich':
            if (this.breakpointObserver.isMatched('(max-width: 600px)')) {
              this.navigationService.setCalendarNavVisibility(false);
            }
            break;
          default:
            break;
        }
      }
    });
  }

  startTour(tourName?: string) {
    if (tourName) {
      switch (tourName) {
        case 'navigationTour':
          this.onStartNavigationTour();
          return;
        case 'homeTour':
          this.onStartHomeTour();
          return;
        case 'calendarTour':
          this.onStartCalendarTour();
          return;
        case 'kinhTour':
          this.onStartKinhTour();
          return;
        case 'kinhDetailTour':
          this.onStartKinhDetailTour();
          return;
      }
    }
    switch (location.pathname.split('/')[1]) {
      case '':
        this.validatedTours('homeTour', () => { this.onStartHomeTour(); }, true);
        break;
      case 'lich':
        this.validatedTours('calendarTour', () => { this.onStartCalendarTour(); }, true);
        break;
      case 'kinh':
        if (location.pathname.split('/')[2]) {
          this.validatedTours('kinhDetailTour', () => { this.onStartKinhDetailTour(); }, true);
        } else {
          this.validatedTours('kinhTour', () => { this.onStartKinhTour(); }, true);
        }
        break;
      // Add more cases for other routes as needed
    }
  }

  onStartNavigationTour(nextTour?: any) {
    const steps = []
    steps.push({
      anchorId: 'start.tour',
      content: 'Chào mừng bạn đến với CaoDaiON! Hãy cùng khám phá các tính năng của ứng dụng.',
      title: 'Chào mừng đến với CaoDaiON',
    });
    steps.push({
      anchorId: 'caodaion-logo',
      content: 'Nhấn vào logo để trở về trang chủ bất cứ lúc nào.',
      title: 'Logo CaoDaiON',
    });
    steps.push({
      anchorId: 'toolbar.qr-scan',
      content: 'Sử dụng tính năng quét mã QR để truy cập nhanh các nội dung và sự kiện.',
      title: 'Quét mã QR',
    });
    steps.push({
      anchorId: 'toolbar.mode-toggle',
      content: 'Sử dụng tính năng chuyển đổi chế độ để thay đổi giao diện ứng dụng.',
      title: 'Chuyển đổi chế độ',
    });
    if (this.breakpointObserver.isMatched('(min-width: 601px)')) {
      steps.push({
        anchorId: 'side.home',
        content: 'Nhấn vào đây để trở về trang chủ.',
        title: 'Trang chủ',
      });
      steps.push({
        anchorId: 'side.lich',
        content: 'Nhấn vào đây để xem lịch.',
        title: 'Lịch',
      });
      steps.push({
        anchorId: 'side.kinh',
        content: 'Nhấn vào đây để xem kinh.',
        title: 'Kinh',
      });
      steps.push({
        anchorId: 'side.apps',
        content: 'Nhấn vào đây để xem tất cả tính năng.',
        title: 'Tất cả tính năng',
      });
    } else {
      steps.push({
        anchorId: 'bottom.home',
        content: 'Nhấn vào đây để trở về trang chủ.',
        title: 'Trang chủ',
      });
      steps.push({
        anchorId: 'bottom.lich',
        content: 'Nhấn vào đây để xem lịch.',
        title: 'Lịch',
      });
      steps.push({
        anchorId: 'bottom.kinh',
        content: 'Nhấn vào đây để xem kinh.',
        title: 'Kinh',
      });
      steps.push({
        anchorId: 'bottom.apps',
        content: 'Nhấn vào đây để xem tất cả tính năng.',
        title: 'Tất cả tính năng',
      });
    }
    this.tourService.initialize(steps, this.defaultStepSetting);
    this.tourService.start();
    this.validatedTours('navigationTour', () => { nextTour ? nextTour() : this.onStartHomeTour(); });
  }

  validatedTours(tourName: string, nextTour?: any, isForceStart: boolean = false) {
    this.tourService.events$.subscribe((event: any) => {
      const localstorageAppTour = JSON.parse(localStorage.getItem('appTour') || '{}');
      if (!isForceStart && (event.name === 'end' || event.name === 'exit')) {
        if (!localstorageAppTour[tourName]) {
          localstorageAppTour[tourName] = true;
          localStorage.setItem('appTour', JSON.stringify(localstorageAppTour));
          if (localstorageAppTour[tourName] && nextTour) {
            nextTour();
          }
        }
      }
    });
    const localstorageAppTour = JSON.parse(localStorage.getItem('appTour') || '{}');
    if (isForceStart && !localstorageAppTour[tourName] && nextTour) {
      if (!localstorageAppTour['navigationTour']) {
        this.onStartNavigationTour(nextTour);
        return;
      }
      nextTour();
    }
  }

  onStartHomeTour() {
    const steps = [
      {
        anchorId: 'home.welcome',
        content: 'Đây là trang chủ của CaoDaiON, nơi bạn có thể tìm thấy các tính năng chính của ứng dụng.',
        title: 'Trang chủ CaoDaiON',
        route: '/'
      },
      {
        anchorId: 'home.shortcuts',
        content: 'Sử dụng các ô chức năng để truy cập nhanh các tính năng chính như Lịch, Kinh, Ứng dụng và nhiều hơn nữa.',
        title: 'Lối tắt nhanh',
        route: '/'
      },
      {
        anchorId: 'home.lunar',
        content: 'Xem nhanh thông tin lịch âm, ngày lễ và các sự kiện quan trọng trong ngày.',
        title: 'Lịch âm',
        route: '/'
      },
    ]
    this.tourService.initialize(steps, this.defaultStepSetting);
    this.tourService.start();
    this.validatedTours('homeTour');
  }

  onStartCalendarTour() {
    const steps = [
      {
        anchorId: 'calendar.today-button',
        content: 'Nhấn vào nút này để quay lại ngày hiện tại trong lịch.',
        title: 'Nút Hôm nay',
        route: '/lich'
      },
      {
        anchorId: 'calendar.previous-button',
        content: 'Nhấn vào nút này để mở tháng/ngày/tuần trước trong lịch.',
        title: 'Nút Trước đó',
        route: '/lich'
      },
      {
        anchorId: 'calendar.next-button',
        content: 'Nhấn vào nút này để mở tháng/ngày/tuần tới trong lịch.',
        title: 'Nút Tiếp theo',
        route: '/lich'
      },
      {
        anchorId: 'calendar.view-switch',
        content: 'Sử dụng các nút này để chuyển đổi giữa các chế độ xem khác nhau của lịch: ngày, tuần, tháng.',
        title: 'Chuyển đổi chế độ xem',
        route: '/lich'
      },
    ]
    if (this.breakpointObserver.isMatched('(min-width: 601px)')) {
      steps.push({
        anchorId: 'side.subnav-toggle',
        content: 'Nhấn vào đây để mở hoặc đóng mở bộ lọc sự kiện trong lịch, hiển thị các ngày ăn chay, hiển thị Can Chi, và sự kiện theo Thánh Sở.',
        title: 'Bộ lọc lịch',
        route: '/lich'
      });
    } else {
      steps.push({
        anchorId: 'side.mobile-subnav-toggle',
        content: 'Nhấn vào đây để mở hoặc đóng mở bộ lọc sự kiện trong lịch, hiển thị các ngày ăn chay, hiển thị Can Chi, và sự kiện theo Thánh Sở.',
        title: 'Bộ lọc lịch',
        route: '/lich'
      });
    }
    steps.push({
      anchorId: 'calendar.otherApps',
      content: 'Nhấn vào đây để truy cập nhanh ứng dụng các ứng dụng liên quan đến lịch',
      title: 'Ứng dụng liên quan',
      route: '/lich'
    });
    steps.push({
      anchorId: 'calendar.eventTypes',
      content: 'Sử dụng bộ lọc này để hiển thị hoặc ẩn các loại sự kiện khác nhau trên lịch.',
      title: 'Lọc theo loại sự kiện',
      route: '/lich'
    });
    steps.push({
      anchorId: 'calendar.displayOptions',
      content: 'Sử dụng bộ lọc này để hiển thị hoặc ẩn các tùy chọn hiển thị khác nhau trên lịch.',
      title: 'Tùy chọn hiển thị',
      route: '/lich'
    });
    steps.push({
      anchorId: 'calendar.thanhso-filter',
      content: 'Sử dụng bộ lọc này để hiển thị hoặc ẩn các sự kiện từ Thánh Sở trên lịch.',
      title: 'Lọc theo Thánh Sở',
      route: '/lich'
    });
    this.tourService.initialize(steps, this.defaultStepSetting);
    this.tourService.start();
    this.validatedTours('calendarTour');
  }

  onStartKinhTour() {
    const steps = [
      {
        anchorId: 'kinh.search',
        content: 'Sử dụng thanh tìm kiếm để nhanh chóng tìm kiếm kinh theo tên',
        title: 'Thanh tìm kiếm',
        route: '/kinh'
      },
      {
        anchorId: 'kinh.filters',
        content: 'Nhấn vào nút này để mở bộ lọc cho các bài kinh theo nhóm.',
        title: 'Bộ lọc kinh',
        route: '/kinh'
      },
      {
        anchorId: 'kinh.view-mode',
        content: 'Nhấn vào nút này để chuyển đổi giữa các chế độ xem khác nhau của danh sách kinh: dạng danh sách và dạng lưới.',
        title: 'Chế độ xem',
        route: '/kinh'
      },
      {
        anchorId: 'kinh.list',
        content: 'Tất cả các bài kinh sẽ được hiển thị ở đây. Nhấn vào một bài kinh để xem nội dung chi tiết.',
        title: 'Danh sách kinh',
        route: '/kinh'
      },
    ]
    this.tourService.initialize(steps, this.defaultStepSetting);
    this.tourService.start();
    this.validatedTours('kinhTour');
  }

  onStartKinhDetailTour() {
    const steps = [
      {
        anchorId: 'kinh.readArea',
        content: 'Đây là khu vực chính để đọc nội dung bài kinh. Bạn có thể cuộn để xem toàn bộ nội dung.',
        title: 'Khu vực đọc kinh',
      },
      {
        anchorId: 'kinh.fontSize',
        content: 'Nhấn vào nút này để thay đổi kích thước phông chữ của bài kinh.',
        title: 'Kích thước phông chữ',
      },
      {
        anchorId: 'kinh.share',
        content: 'Nhấn vào nút này để chia sẻ bài kinh với người khác.',
        title: 'Chia sẻ bài kinh',
      },
      { anchorId: 'kinh.listFab',
        content: 'Nhấn vào nút này để mở danh sách các bài kinh.',
        title: 'Danh sách bài kinh',
      },
      { anchorId: 'kinh.navigationBar',
        content: 'Sử dụng thanh điều hướng này để mở bài kinh trước đó hoặc tiếp theo trong danh sách.',
        title: 'Thanh điều hướng',
      },
    ]
    this.tourService.initialize(steps, this.defaultStepSetting);
    this.tourService.start();
    this.validatedTours('kinhDetailTour');
  }
}
