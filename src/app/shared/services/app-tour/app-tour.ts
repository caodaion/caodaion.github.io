import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppTour {

  isMobile: boolean = false;
  nextBtnTitle = 'Tiếp tục';
  prevBtnTitle = 'Quay lại';
  endBtnTitle = 'Kết thúc';
  navigationRailTour = [
    {
      anchorId: 'navigationRail',
      content: 'Sử dụng menu bên trái để điều hướng',
      title: 'Menu điều hướng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailToggleSubNav',
      content: 'Nhấn vào đây để mở menu phụ',
      title: 'Mở menu phụ',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailToggleDarkMode',
      content: 'Đây là nút chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!',
      title: 'Chuyển đổi chế độ tối',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailHome',
      content: 'Đây là nút để về trang chủ. Chúng ta sẽ quay về trang chủ!',
      title: 'Về trang chủ',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailLich',
      content: 'Đây là nút để xem lịch. Chúng ta sẽ chuyển đến trang lịch ngay bây giờ!',
      title: 'Xem lịch',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailKinh',
      content: 'Đây là nút để xem kinh. Chúng ta sẽ chuyển đến trang kinh!',
      title: 'Xem kinh',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'navigationRailApps',
      content: 'Đây là nút để xem tất cả ứng dụng. Chúng ta sẽ chuyển đến trang ứng dụng!',
      title: 'Xem ứng dụng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
  ]

  bottomNavigationBarTour = [
    {
      anchorId: 'bottomNavigationBar',
      content: 'Sử dụng thanh điều hướng',
      title: 'Thanh điều hướng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'bottomNavigationBarHome',
      content: 'Đây là nút để về trang chủ. Chúng ta sẽ quay về trang chủ!',
      title: 'Về trang chủ',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'bottomNavigationBarLich',
      content: 'Đây là nút để xem lịch. Chúng ta sẽ chuyển đến trang lịch ngay bây giờ!',
      title: 'Xem lịch',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'bottomNavigationBarKinh',
      content: 'Đây là nút để xem kinh. Chúng ta sẽ chuyển đến trang kinh!',
      title: 'Xem kinh',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'bottomNavigationBarApps',
      content: 'Đây là nút để xem tất cả ứng dụng. Chúng ta sẽ chuyển đến trang ứng dụng!',
      title: 'Xem ứng dụng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
  ]

  toolbarTour = [
    {
      anchorId: 'toolbarLogo',
      content: 'Đây là logo của ứng dụng, nhấn vào đây để về trang chủ',
      title: 'Logo ứng dụng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'toolbarQRCodeScanner',
      content: 'Đây là biểu tượng quét mã QR, nhấn vào đây để mở quét mã',
      title: 'Quét mã QR',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'toolbarDarkModeToggle',
      content: 'Đây là biểu tượng chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!',
      title: 'Chuyển đổi chế độ tối',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    }
  ]

  toolbarTourMobile = [
    {
      anchorId: 'toolbarLogo',
      content: 'Đây là logo của ứng dụng, nhấn vào đây để về trang chủ',
      title: 'Logo ứng dụng',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'toolbarSubnavToggle',
      content: 'Nhấn vào đây để mở menu phụ',
      title: 'Mở menu phụ',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'toolbarQRCodeScanner',
      content: 'Đây là biểu tượng quét mã QR, nhấn vào đây để mở quét mã',
      title: 'Quét mã QR',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    },
    {
      anchorId: 'toolbarDarkModeToggle',
      content: 'Đây là biểu tượng chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!',
      title: 'Chuyển đổi chế độ tối',
      enableBackdrop: true,
      prevBtnTitle: this.prevBtnTitle,
      nextBtnTitle: this.nextBtnTitle,
      endBtnTitle: this.endBtnTitle
    }
  ]

  constructor(
    private tourService: TourService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
      .subscribe((matches) => {
        this.isMobile = matches;
      });
  }

  fetchNavigationTour() {
    const localStorageAppTours = localStorage.getItem('appTours');
    const appTours = localStorageAppTours ? JSON.parse(localStorageAppTours) : null;
    if (appTours && appTours.navigation) {
      // If navigation tour is done, check if we should start toolbar tour
      this.fetchToolbarTour();
      return;
    }
    const tourSteps = this.isMobile ? this.bottomNavigationBarTour : this.navigationRailTour;
    this.tourService.initialize(tourSteps);
    this.tourService.start();
    this.tourService.end$.subscribe(() => {
      const localStorageAppTours = localStorage.getItem('appTours');
      const appTours = localStorageAppTours ? JSON.parse(localStorageAppTours) : <any>{};
      appTours.navigation = true;
      localStorage.setItem('appTours', JSON.stringify(appTours));

      // Start toolbar tour after navigation tour is completed
      setTimeout(() => {
          this.fetchToolbarTour();
      }, 500);
    });
  }

  fetchToolbarTour() {
    const localStorageAppTours = localStorage.getItem('appTours');
    const appTours = localStorageAppTours ? JSON.parse(localStorageAppTours) : null;
    if (appTours && appTours.navigation && appTours.toolbar) {
      return;
    }
    const tourSteps = this.isMobile ? this.toolbarTourMobile : this.toolbarTour;
    this.tourService.initialize(tourSteps);
    this.tourService.start();
    this.tourService.end$.subscribe(() => {
      const localStorageAppTours = localStorage.getItem('appTours');
      const appTours = localStorageAppTours ? JSON.parse(localStorageAppTours) : <any>{};
      appTours.toolbar = true;
      localStorage.setItem('appTours', JSON.stringify(appTours));
    });
  }
}
