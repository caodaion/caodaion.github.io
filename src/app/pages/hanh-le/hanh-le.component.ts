import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hanh-le',
    templateUrl: './hanh-le.component.html',
    styleUrls: ['./hanh-le.component.scss'],
    standalone: false
})
export class HanhLeComponent implements OnInit {


  cols: any;
  nghiTiet = <any>[
    {
      key: 'nghi-tiet-dai-va-trung-dan',
      name: 'Nghi-tiết Đại và Trung đàn'
    },
    {
      key: 'nghi-tiet-tay-thien-dien',
      name: 'Nghi-tiết Tây Thiên Điện'
    },
    {
      key: 'nghi-ha-tho',
      name: 'Nghi Hạ Thọ'
    },
    {
      key: 'nghi-cao-tu-to',
      name: 'Nghi cáo từ tổ'
    },
    {
      key: 'nghi-thanh-phuc',
      name: 'Nghi thành phục',
      published: true,
    },
    {
      key: 'nghi-dieu-te',
      name: 'Nghi điếu tế'
    },
    {
      key: 'nghi-cao-minh-sanh',
      name: 'Nghi cáo minh sanh'
    },
    {
      key: 'nghi-tien-biet',
      name: 'Nghi tiễn biệt',
      published: true,
    },
    {
      key: 'nghi-phat-hanh',
      name: 'Nghi phát hành'
    },
    {
      key: 'nghi-so-ngu',
      name: 'Nghi sơ ngu'
    },
    {
      key: 'nghi-tuan-tu',
      name: 'Nghi tuần tự'
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver) {
  }
  ngOnInit(): void {

    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1;
        } else {
          this.cols = 6;
        }
      });
  }
}
