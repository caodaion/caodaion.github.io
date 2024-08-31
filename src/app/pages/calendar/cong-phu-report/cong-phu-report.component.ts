import { DatePipe } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-cong-phu-report',
  templateUrl: './cong-phu-report.component.html',
  styleUrls: ['./cong-phu-report.component.scss']
})
export class CongPhuReportComponent implements AfterViewInit {
  user: any;
  startDate: any;
  viewDetailsData: any;
  selectedIndex = 0;
  displayData: any;

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe
  ) {

  }

  ngAfterViewInit(): void {
    this.authService.getCurrentUser()
      .subscribe((res: any) => {
        this.user = res
        this.initChart()
      })
  }

  initChart() {
    this.viewDetailsData = null
    this.startDate = this.user.congPhu[0].dateTime
    let data = <any>[];
    var now = new Date();
    for (var d = new Date(this.startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateValue = new Date(d);
      const foundDate = this.user.congPhu?.find((item: any) => item?.dateTime?.toString() == dateValue?.toString())
      const focusArray = foundDate?.data?.map((item: any) => item?.focus)
      const focusSum = focusArray?.reduce((a: any, b: any) => a + b, 0)
      const qualityArray = foundDate?.data?.map((item: any) => item?.quality)
      const qualitySum = qualityArray?.reduce((a: any, b: any) => a + b, 0)
      let averageFocus = (focusSum / focusArray?.length) || 0
      let qualityFocus = (qualitySum / qualityArray?.length) || 0
      data.push({
        date: new Date(d),
        data: foundDate?.data,
        averageFocus: averageFocus,
        qualityFocus: qualityFocus,
      });
    }
    this.displayData = data
    this.selectedIndex = this.displayData.length - 1
    this.viewDetailsData = this.displayData[this.selectedIndex]
    const ctx = document.getElementById('congPhuReport')
    new Chart(
      // @ts-ignore
      ctx,
      {
        type: 'bar',
        options: {
          responsive: true,
          onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
              const element = elements[0];
              const index = element.index;
              this.viewDetailsData = data[index]
            }
          }
        },
        data: {
          labels: data?.map((row: any) => this.datePipe.transform(row?.date, 'dd/MM/YY')),
          datasets: [
            {
              label: `Trung bình trạng thái tập trung `,
              data: data?.map((row: any) => row?.averageFocus),
              type: 'line',
              tension: 0.4,
              borderColor: 'rgba(234, 67, 53, 1)',
              backgroundColor: 'rgba(234, 67, 53, 0.5)',
            },
            {
              label: `Trung bình chất lượng`,
              data: data?.map((row: any) => row?.qualityFocus),
              type: 'line',
              tension: 0.4,
              borderColor: 'rgba(71, 88, 184, 1)',
              backgroundColor: 'rgba(71, 88, 184, 0.5)',
            },
            {
              label: `Số thời đã cúng trong ngày`,
              data: data?.map((row: any) => row?.data?.length),
              type: 'bar',
              backgroundColor: 'rgba(251, 188, 5, 0.2)',
              borderColor: 'rgba(251, 188, 5, 1)',
              borderWidth: 1,
              borderRadius: 50
            },
          ]
        }
      }
    );
  }

  getValuePoint(type: any, point: any) {
    switch (type) {
      case 'focus':
        switch (point) {
          case -3: return 'Hoàn toàn sao nhãng';
          case -2: return 'Sao nhãng nhiều';
          case -1: return 'Có sao nhãng';
          case 0: return 'Bình thường';
          case 1: return 'Tập trung';
          case 2: return 'Tập trung cao';
          case 3: return 'Tập trung toàn phần';
          default: return ''
        }
      case 'quality':
        switch (point) {
          case -2: return 'Rất không tốt';
          case -1: return 'Không tốt';
          case 0: return 'Bình thường';
          case 1: return 'Tốt';
          case 2: return 'Rất tốt';
          case 3: return 'Hoàn hảo';
          default: return ''
        }
      default: return ''
    }
  }
}
