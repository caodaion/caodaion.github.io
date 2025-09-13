import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { map } from 'rxjs';

interface TourStep {
  anchorId: string;
  content: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppTour {
  private readonly STORAGE_KEY = 'appTours';
  private readonly BUTTON_TITLES = {
    next: 'Tiếp tục',
    prev: 'Quay lại',
    end: 'Kết thúc'
  };

  isMobile = false;

  private readonly tourSteps = {
    navigationRail: [
      { anchorId: 'navigationRail', title: 'Menu điều hướng', content: 'Sử dụng menu bên trái để điều hướng' },
      { anchorId: 'navigationRailToggleSubNav', title: 'Mở menu phụ', content: 'Nhấn vào đây để mở menu phụ' },
      { anchorId: 'navigationRailToggleDarkMode', title: 'Chuyển đổi chế độ tối', content: 'Đây là nút chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!' },
      { anchorId: 'navigationRailHome', title: 'Về trang chủ', content: 'Đây là nút để về trang chủ. Chúng ta sẽ quay về trang chủ!' },
      { anchorId: 'navigationRailLich', title: 'Xem lịch', content: 'Đây là nút để xem lịch. Chúng ta sẽ chuyển đến trang lịch ngay bây giờ!' },
      { anchorId: 'navigationRailKinh', title: 'Xem kinh', content: 'Đây là nút để xem kinh. Chúng ta sẽ chuyển đến trang kinh!' },
      { anchorId: 'navigationRailApps', title: 'Xem ứng dụng', content: 'Đây là nút để xem tất cả ứng dụng. Chúng ta sẽ chuyển đến trang ứng dụng!' }
    ],
    bottomNavigation: [
      { anchorId: 'bottomNavigationBar', title: 'Thanh điều hướng', content: 'Sử dụng thanh điều hướng' },
      { anchorId: 'bottomNavigationBarHome', title: 'Về trang chủ', content: 'Đây là nút để về trang chủ. Chúng ta sẽ quay về trang chủ!' },
      { anchorId: 'bottomNavigationBarLich', title: 'Xem lịch', content: 'Đây là nút để xem lịch. Chúng ta sẽ chuyển đến trang lịch ngay bây giờ!' },
      { anchorId: 'bottomNavigationBarKinh', title: 'Xem kinh', content: 'Đây là nút để xem kinh. Chúng ta sẽ chuyển đến trang kinh!' },
      { anchorId: 'bottomNavigationBarApps', title: 'Xem ứng dụng', content: 'Đây là nút để xem tất cả ứng dụng. Chúng ta sẽ chuyển đến trang ứng dụng!' }
    ],
    toolbar: [
      { anchorId: 'toolbarLogo', title: 'Logo ứng dụng', content: 'Đây là logo của ứng dụng, nhấn vào đây để về trang chủ' },
      { anchorId: 'toolbarQRCodeScanner', title: 'Quét mã QR', content: 'Đây là biểu tượng quét mã QR, nhấn vào đây để mở quét mã' },
      { anchorId: 'toolbarDarkModeToggle', title: 'Chuyển đổi chế độ tối', content: 'Đây là biểu tượng chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!' }
    ],
    toolbarMobile: [
      { anchorId: 'toolbarLogo', title: 'Logo ứng dụng', content: 'Đây là logo của ứng dụng, nhấn vào đây để về trang chủ' },
      { anchorId: 'toolbarSubnavToggle', title: 'Mở menu phụ', content: 'Nhấn vào đây để mở menu phụ' },
      { anchorId: 'toolbarQRCodeScanner', title: 'Quét mã QR', content: 'Đây là biểu tượng quét mã QR, nhấn vào đây để mở quét mã' },
      { anchorId: 'toolbarDarkModeToggle', title: 'Chuyển đổi chế độ tối', content: 'Đây là biểu tượng chuyển đổi chế độ tối. Chế độ đã được chuyển đổi để bạn thấy sự khác biệt!' }
    ]
  };

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

  private createTourSteps(steps: TourStep[]) {
    return steps.map(step => ({
      ...step,
      enableBackdrop: true,
      prevBtnTitle: this.BUTTON_TITLES.prev,
      nextBtnTitle: this.BUTTON_TITLES.next,
      endBtnTitle: this.BUTTON_TITLES.end
    }));
  }

  private getTourState() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  private saveTourState(key: string) {
    const tourState = this.getTourState();
    tourState[key] = true;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tourState));
  }

  fetchNavigationTour() {
    const tourState = this.getTourState();
    if (tourState.navigation) {
      this.fetchToolbarTour();
      return;
    }

    const steps = this.isMobile ? this.tourSteps.bottomNavigation : this.tourSteps.navigationRail;
    const tourSteps = this.createTourSteps(steps);

    this.tourService.initialize(tourSteps);
    this.tourService.start();

    this.tourService.end$.subscribe(() => {
      this.saveTourState('navigation');
      setTimeout(() => this.fetchToolbarTour(), 500);
    });
  }

  fetchToolbarTour() {
    const tourState = this.getTourState();
    if (tourState.navigation && tourState.toolbar) {
      return;
    }

    const steps = this.isMobile ? this.tourSteps.toolbarMobile : this.tourSteps.toolbar;
    const tourSteps = this.createTourSteps(steps);

    this.tourService.initialize(tourSteps);
    this.tourService.start();

    this.tourService.end$.subscribe(() => {
      this.saveTourState('toolbar');
    });
  }
}
