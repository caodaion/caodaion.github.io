import { DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Chart } from 'chart.js/auto';
import * as moment from 'moment';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CongPhuService } from 'src/app/shared/services/cong-phu/cong-phu.service';

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
  congPhuSetting: any = <any>{}
  congPhuFilterSetting: any = <any>[]
  congPhuRawData: any = <any>[]
  congPhu: any = <any>[]
  filteringName = <any>[]
  filteredDataSets = <any>[]
  chartDataSetting = <any>[]

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private congPhuService: CongPhuService,
    private decimalPipe: DecimalPipe
  ) {

  }

  ngAfterViewInit(): void {
    const localCongPhuData = JSON.parse(localStorage.getItem('congPhuData') || '{}')
    this.filteringName = [localCongPhuData.na + '-' + localCongPhuData.by + '-' + localCongPhuData.tt]
    this.selectedTimeRange = this.datePipe.transform(new Date(), 'yyyy-MM')
    this.refreshData()
  }

  refreshData() {
    this.targetRange = <any>[]
    this.fetchCongPhuData()
  }

  fetchCongPhuData() {
    this.congPhuService.fetchCongPhuData()
      .subscribe((res: any) => {
        console.log(res);
        this.congPhuFilterSetting = res?.filterSetting
        this.congPhuSetting = res?.setting
        this.congPhuRawData = JSON.parse(JSON.stringify(res?.data))
        this.initChart()
      })
  }

  initChart() {
    this.congPhu = <any>[]
    this.filteringName?.forEach((filterItem: any) => {
      const foundItem = this.congPhuRawData?.filter((item: any) => {
        return item?.name?.na == filterItem.split('-')[0] && item?.name?.by == filterItem.split('-')[1] && item?.name?.tt == filterItem.split('-')[2]
      })
      if (foundItem?.length) {
        this.congPhu = this.congPhu.concat(foundItem)
      }
    })
    this.congPhu?.forEach((item: any) => {
      if (!this.timeFilterOptions.find((timeFilterItem: any) => timeFilterItem?.key === item?.data?.yy)) {
        this.timeFilterOptions.push({
          key: item?.data?.yy,
          month: Array.from({ length: 12 }, (x, i) => i + 1)
        })
      }
    })
    this.calculateConsecutiveDays()
    if (!this.selectedTimeRange) return;
    const [year, month] = this.selectedTimeRange.split('-').map(Number);
    const filteredData = this.congPhu?.filter((item: any) => item?.data?.yy == year && item?.data?.mm == month)
    this.renderChart(filteredData);
  }

  calculateConsecutiveDays() {
    this.chartDataSetting = this.filteringName?.map((filterItem: any) => {
      const foundItem = this.congPhu?.filter((item: any) => item?.name?.na == filterItem.split('-')[0] && item?.name?.by == filterItem.split('-')[1] && item?.name?.tt == filterItem.split('-')[2])

      const dataPoints = foundItem.map((item: any) => {
        const calculatedDate = () => {
          if (new Date(new Date().setHours(parseInt(item?.data?.ti.split(':')[0]), parseInt(item?.data?.ti.split(':')[1]), 59)) >= new Date(new Date().setHours(22, 59, 59))) {
            const calculatingDate = new Date(item?.data?.yy, item?.data?.mm - 1, item?.data?.dd)
            return new Date(calculatingDate.setDate(calculatingDate.getDate() + 1))
          }
          return new Date(item?.data?.yy, item?.data?.mm - 1, item?.data?.dd)
        }
        return {
          date: this.datePipe.transform(calculatedDate(), 'yyyy-MM-dd'),
          time: item?.data?.ti
        }
      })
      return {
        name: filterItem,
        dataPoints: dataPoints
      }
    })
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
    const endDate = new Date(Math.min(
      new Date().getTime(),
      new Date(this.selectedTimeRange.split('-')[0], this.selectedTimeRange.split('-')[1], 0).getTime()
    ));
    // [
    //   {
    //     type: 'bar',
    //     label: 'Bar Dataset',
    //     data: [10, 20, 30, 40]
    //   },
    //   {
    //     type: 'line',
    //     label: 'Line Dataset',
    //     data: [50, 50, 50, 50],
    //   }
    // ]

    const datasets = this.filteringName.map((filterItem: any) => {
      const foundItem = data?.filter((item: any) => item?.name?.na == filterItem.split('-')[0] && item?.name?.by == filterItem.split('-')[1] && item?.name?.tt == filterItem.split('-')[2])

      const dataPoint = Array.from({ length: endDate.getDate() }, (x, i) => i + 1).map((item: any) => {
        const foundItemDate = foundItem?.filter((dateItem: any, index: number) => {
          const currentDate = new Date(dateItem.data.yy, dateItem.data.mm - 1, dateItem.data.dd);
          const itemDate = currentDate.getDate();
          const itemTime = dateItem.data.ti.split(':')[0];

          if (itemDate === item) {
            if (parseInt(itemTime) < 23) {
              return true;
            }
          } else if (itemDate === item - 1) {
            if (parseInt(itemTime) >= 23) {
              return true;
            }
          }
          return false;
        })
        return foundItemDate.length
      })

      return {
        label: filterItem,
        type: 'bar',
        data: dataPoint,
        borderRadius: Number.MAX_VALUE,
        borderWidth: 2,
        borderSkipped: false,
      }
    })
    this.chart = new Chart(ctx, {
      data: {
        datasets: datasets,
        labels: Array.from({ length: endDate.getDate() }, (x, i) => this.decimalPipe.transform(i + 1, '2.0-0'))
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string, index: number, values: any[]) => {
                if (typeof value === 'number' && Math.floor(value) === value) {
                  return value.toString();
                }
                return null;
              }
            }
          }
        },
        onClick: (event: any, elements: any) => {
          // if (elements.length > 0) {
          //   const index = elements[0].index;
          //   this.viewDetailsData = this.displayData[index];
          // }
        }
      },
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
