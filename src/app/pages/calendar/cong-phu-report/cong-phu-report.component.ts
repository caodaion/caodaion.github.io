import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Chart } from 'chart.js/auto';
import * as moment from 'moment';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-cong-phu-report',
  templateUrl: './cong-phu-report.component.html',
  styleUrls: ['./cong-phu-report.component.scss']
})
export class CongPhuReportComponent implements AfterViewInit {
  user: any;
  viewDetailsData: any;
  displayData: any;
  nextTarget: number = 0;
  timeFilterOptions: any = <any>[]
  selectedTimeRange: any;
  chart: any;
  icon: any;
  targetRange: any = <any>[]

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {

  }

  ngAfterViewInit(): void {
    this.authService.getCurrentUser()
      .subscribe((res: any) => {
        this.user = res
        const foundTitleIndex = CAODAI_TITLE.data?.findIndex((ct: any) => ct?.key === this.user?.title)
        if (foundTitleIndex < 3) {
          this.icon = 'candle'
        } else {
          this.icon = 'self_improvement phu'
        }
        if (this.user?.consecutive) {
          this.nextTarget = JSON.parse(JSON.stringify(this.user?.consecutive))
          while (this.nextTarget % 5 != 0) {
            this.nextTarget += 1
            this.cd.detectChanges();
          }
          for (let index = this.nextTarget - 5; index < this.nextTarget + 15; index += 5) {
            this.targetRange.push(index)
          }
        }
        this.user.congPhu?.forEach((item: any) => {
          if (!this.timeFilterOptions?.find((tfo: any) => tfo.key == item?.year)) {
            this.timeFilterOptions?.push({ key: item?.year, month: this.user.congPhu?.filter((cpm: any) => cpm?.year === item?.year)?.map((cpm: any) => { return { key: cpm?.month } }) })
          }
        })
        this.selectedTimeRange = this.datePipe.transform(new Date(), 'YYYY-MM')

        this.breakpointObserver
          .observe(['(max-width: 600px)'])
          .subscribe((state: BreakpointState) => {
            this.initChart()
          });
        this.cd.detectChanges();
        this.cd.detectChanges();
      })
  }

  initChart() {
    if (this.selectedTimeRange) {
      const filteredData: any = this.user.congPhu?.filter((item: any) => item?.year === parseInt(this.selectedTimeRange.split('-')[0]) && item?.month === parseInt(this.selectedTimeRange.split('-')[1]))
      if (filteredData?.length > 0) {
        this.viewDetailsData = null
        const calculateDate = new Date(new Date(new Date(new Date().setFullYear(parseInt(this.selectedTimeRange.split('-')[0]))).setMonth(parseInt(this.selectedTimeRange.split('-')[1]) - 1)))
        const startDate = new Date(calculateDate.setDate(1))
        let data = <any>[];
        var now = new Date(new Date(moment(calculateDate).endOf('month').format('YYYY-MM-DD')).setDate(new Date(moment(calculateDate).endOf('month').format('YYYY-MM-DD')).getDate() + 1));
        for (var d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
          const dateValue = new Date(new Date(d).setHours(0, 0, 0));
          const foundDate = filteredData?.find((item: any) => item?.dateTime?.toString() == dateValue?.toString())
          const focusArray = foundDate?.data?.map((item: any) => item?.focus)
          const focusSum = focusArray?.reduce((a: any, b: any) => a + b, 0)
          const qualityArray = foundDate?.data?.map((item: any) => item?.quality)
          const qualitySum = qualityArray?.reduce((a: any, b: any) => a + b, 0)
          let averageFocus = (focusSum / focusArray?.length) || 0
          let qualityFocus = (qualitySum / qualityArray?.length) || 0
          data.push({
            date: dateValue,
            data: foundDate?.data,
            averageFocus: averageFocus,
            qualityFocus: qualityFocus,
          });
        }
        this.displayData = data
        const ctx = document.getElementById('congPhuReport')
        this.chart?.destroy()
        this.chart = new Chart(
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
              labels: data?.map((row: any) => this.datePipe.transform(row?.date, 'dd')),
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
    }
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
