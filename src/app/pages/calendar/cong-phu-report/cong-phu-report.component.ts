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
    this.refreshData()
  }

  refreshData() {
    this.targetRange = <any>[]
    this.authService.getCurrentUser(true)
      .subscribe((res: any) => {
        this.user = res        
        const foundTitleIndex = CAODAI_TITLE.data?.findIndex((ct: any) => ct?.key === this.user?.title)
        this.icon = foundTitleIndex < 3 ? 'candle' : 'self_improvement';
        if (this.user?.consecutive) {
          this.nextTarget = Math.ceil(this.user.consecutive / 5) * 5;
          this.targetRange = Array.from({length: 5}, (_, i) => this.nextTarget + (i - 2) * 5);
        }

        const years = [...new Set(this.user.congPhu?.map((item: any) => item.year))];
        this.timeFilterOptions = years.map(year => ({
          key: year,
          month: [...new Set(this.user.congPhu
            ?.filter((cpm: any) => cpm.year === year)
            ?.map((cpm: any) => cpm.month))]
        }));
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
    if (!this.selectedTimeRange) return;

    const [year, month] = this.selectedTimeRange.split('-').map(Number);
    const filteredData = this.user.congPhu?.filter((item: any) => 
      item?.year === year && item?.month === month
    );

    if (!filteredData?.length) return;

    this.viewDetailsData = null;
    const calculateDate = new Date(year, month - 1);
    const startDate = new Date(calculateDate.setDate(1));
    const endDate = new Date(Math.min(
      new Date().getTime(),
      new Date(year, month, 0).getTime()
    ));

    const data = this.generateChartData(startDate, endDate, filteredData);
    this.displayData = data;

    this.renderChart(data);
  }

  private generateChartData(startDate: Date, endDate: Date, filteredData: any[]) {
    const data = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateValue = new Date(d.setHours(0, 0, 0, 0));
      const foundDate = filteredData.find((item: any) => 
        new Date(item?.dateTime).setHours(0, 0, 0, 0) === dateValue.getTime()
      );

      if (foundDate) {
        const { averageFocus, qualityFocus } = this.calculateAverages(foundDate.data);
        data.push({
          date: dateValue,
          data: foundDate.data,
          averageFocus,
          qualityFocus,
        });
      } else {
        data.push({
          date: dateValue,
          data: [],
          averageFocus: 0,
          qualityFocus: 0,
        });
      }
    }
    return data;
  }

  private calculateAverages(data: any[]) {
    if (!data?.length) return { averageFocus: 0, qualityFocus: 0 };

    const focusSum = data.reduce((sum, item) => sum + (item?.focus || 0), 0);
    const qualitySum = data.reduce((sum, item) => sum + (item?.quality || 0), 0);

    return {
      averageFocus: focusSum / data.length,
      qualityFocus: qualitySum / data.length,
    };
  }

  private renderChart(data: any[]) {
    const ctx = document.getElementById('congPhuReport') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'bar',
      options: {
        responsive: true,
        onClick: (event: any, elements: any) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            this.viewDetailsData = this.displayData[index];
          }
        }
      },
      data: {
        labels: data.map((row: any) => this.datePipe.transform(row.date, 'dd')),
        datasets: [
          {
            label: 'Trung bình trạng thái tập trung',
            data: data.map((row: any) => row.averageFocus),
            type: 'line',
            tension: 0.4,
            borderColor: 'rgba(234, 67, 53, 1)',
            backgroundColor: 'rgba(234, 67, 53, 0.5)',
          },
          {
            label: 'Trung bình chất lượng',
            data: data.map((row: any) => row.qualityFocus),
            type: 'line',
            tension: 0.4,
            borderColor: 'rgba(71, 88, 184, 1)',
            backgroundColor: 'rgba(71, 88, 184, 0.5)',
          },
          {
            label: 'Số thời đã cúng trong ngày',
            data: data.map((row: any) => row.data.length),
            type: 'bar',
            backgroundColor: 'rgba(251, 188, 5, 0.2)',
            borderColor: 'rgba(251, 188, 5, 1)',
            borderWidth: 1,
            borderRadius: 50
          },
        ]
      }
    });
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
