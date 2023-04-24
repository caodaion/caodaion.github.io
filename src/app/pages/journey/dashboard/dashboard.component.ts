import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Output } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { CHECKINEVENT, CHECKINTYPES } from 'src/app/shared/constants/master-data/check-in.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'ng2-charts-demo';
  public isShowChart: boolean = true
  public isShowPhoneLayout: boolean = true
  // Pie
  public ratingPieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public ratingPieChartLabels = ["Hoàn toàn không", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng", "Chưa đánh giá"];
  public ratingPieChartDatasets = [{
    data: [0, 0, 0, 0, 0, 0]
  }];
  public ratingPieChartLegend = true;
  public ratingPieChartPlugins = [];

  public typePieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public typePieChartLabels = <any>[];
  public typePieChartDatasets = [{
    data: <any>[]
  }];
  public typePieChartLegend = true;
  public typePieChartPlugins = [];
  localStorageData = <any>[];
  displayedColumns = ['timestamp', 'type', 'location', 'rating', 'comment']
  @Output() onShowLogClick = new EventEmitter();

  constructor(
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isShowPhoneLayout = true;
        } else {
          this.isShowPhoneLayout = false;
        }
      });
    this.getData()
  }

  getData() {
    this.isShowChart = false
    const localStorageData = JSON.parse(localStorage.getItem('journey') || '[]')
    this.localStorageData = localStorageData
    console.log(localStorageData);
    let ratingData = [0, 0, 0, 0, 0, 0]
    if (localStorageData?.length > 0) {
      localStorageData?.forEach((item: any) => {
        switch (item.rating) {
          case 1: ratingData[0] += 1
            break;
          case 2: ratingData[1] += 1
            break;
          case 3: ratingData[2] += 1
            break;
          case 4: ratingData[3] += 1
            break;
          case 5: ratingData[4] += 1
            break;
          default:
            ratingData[5] += 1
            break;
        }
      })
      localStorageData?.forEach((item: any) => {
        const foundType = CHECKINEVENT?.find((cit: any) => item?.type == cit?.key)
        if (foundType) {
          let label: any = foundType.label
          if (item.tuThoiType) {
            label = `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
          }
          if (!this.typePieChartLabels?.find((tpcl: any) => tpcl == label)) {
            this.typePieChartLabels.push(label)
          }
          const pushDataIndex = this.typePieChartLabels.indexOf(label)
          if (this.typePieChartDatasets[0].data[pushDataIndex]) {
            this.typePieChartDatasets[0].data[pushDataIndex] += 1
          } else {
            this.typePieChartDatasets[0].data.push(1)
          }
        } else {
          if (!this.typePieChartLabels?.find((tpcl: any) => tpcl == 'Chưa xác định')) {
            this.typePieChartLabels.push('Chưa xác định')
          }
          const pushDataIndex = this.typePieChartLabels.indexOf('Chưa xác định')
          if (this.typePieChartDatasets[0].data[pushDataIndex]) {
            this.typePieChartDatasets[0].data[pushDataIndex] += 1
          } else {
            this.typePieChartDatasets[0].data.push(1)
          }
        }
      })
      this.ratingPieChartDatasets[0].data = ratingData
      setTimeout(() => {
        this.isShowChart = true
      }, 0)
    } else {
      this.isShowChart = false
    }
  }

  getRowData(item: any, object: any) {
    if (object == 'location') {
      return CHECKINTYPES.find((cit: any) => cit.key == item.location)?.label || 'Chưa xác định'
    }
    if (object == 'type') {
      if (item?.tuThoiType) {
        return `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
      }
      return CHECKINEVENT.find((cie: any) => cie.key == item.type)?.label || 'Chưa xác định'
    }
    return ''
  }

  onShowLog() {
    this.onShowLogClick.emit()
  }
}
