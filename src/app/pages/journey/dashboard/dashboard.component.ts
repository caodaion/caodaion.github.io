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

  public devicePieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public devicePieChartLabels = <any>[];
  public devicePieChartDatasets = [{
    data: <any>[]
  }];
  public devicePieChartLegend = true;
  public devicePieChartPlugins = [];

  public methodPieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public methodPieChartLabels = <any>[];
  public methodPieChartDatasets = [{
    data: <any>[]
  }];
  public methodPieChartLegend = true;
  public methodPieChartPlugins = [];

  public locationPieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public locationPieChartLabels = <any>[];
  public locationPieChartDatasets = [{
    data: <any>[]
  }];
  public locationPieChartLegend = true;
  public locationPieChartPlugins = [];

  localStorageData = <any>[];
  displayedColumns = ['timestamp', 'type', 'location', 'rating', 'comment', 'device', 'action']
  @Output() onShowLogClick = new EventEmitter();
  @Output() onUpdateJourneyClick = new EventEmitter();
  @Output() onRemoveJourneyClick = new EventEmitter();
  checkInTypes = CHECKINTYPES
  checkInEvents = CHECKINEVENT

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

  mergeLocalstorageVariable() {
    const mergeLocation = () => {
      let localstorageLocation = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.location
      if (localstorageLocation && localstorageLocation?.length > 0) {
        this.checkInTypes = this.checkInTypes.concat(localstorageLocation.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    const mergeType = () => {
      let localstorageType = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.type
      if (localstorageType && localstorageType?.length > 0) {
        this.checkInEvents = this.checkInEvents.concat(localstorageType.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    mergeLocation()
    mergeType()
  }

  getData() {
    this.mergeLocalstorageVariable()
    this.isShowChart = false
    const localStorageData = JSON.parse(localStorage.getItem('journey') || '[]')
    this.localStorageData = localStorageData.sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1)
    let ratingData = [0, 0, 0, 0, 0, 0]
    if (localStorageData?.length > 0) {
      localStorageData?.forEach((item: any) => {
        const updateRatingChart = () => {
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
        }
        const updateLabelChart = () => {
          const foundType = this.checkInEvents?.find((cit: any) => item?.type == cit?.key)
          if (foundType) {
            let label: any = foundType.label
            if (item.tuThoiType) {
              label = `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
            }
            if (!this.typePieChartLabels?.find((tpcl: any) => tpcl == label)) {
              this.typePieChartLabels.push(label)
            }
            const pushDataIndex = this.typePieChartLabels.indexOf(label)
            if (pushDataIndex !== -1 && this.typePieChartDatasets[0].data[pushDataIndex]) {
              this.typePieChartDatasets[0].data[pushDataIndex] += 1
            } else {
              this.typePieChartDatasets[0].data.push(1)
            }
          } else {
            if (!this.typePieChartLabels?.find((tpcl: any) => tpcl == 'Chưa xác định')) {
              this.typePieChartLabels.push('Chưa xác định')
            }
            const pushDataIndex = this.typePieChartLabels.indexOf('Chưa xác định')
            if (pushDataIndex !== -1 && this.typePieChartDatasets[0].data[pushDataIndex]) {
              this.typePieChartDatasets[0].data[pushDataIndex] += 1
            } else {
              this.typePieChartDatasets[0].data.push(1)
            }
          }
        }
        const updateDeviceChart = () => {
          if (!this.devicePieChartLabels?.find((dv: any) => dv == item?.device)) {
            this.devicePieChartLabels.push(item?.device)
          }
          const pushDataIndex = this.devicePieChartLabels.indexOf(item.device)
          if (pushDataIndex !== -1 && this.devicePieChartDatasets[0].data[pushDataIndex]) {
            this.devicePieChartDatasets[0].data[pushDataIndex] += 1
          } else {
            this.devicePieChartDatasets[0].data.push(1)
          }
        }

        const updateMethodChart = () => {
          if (!this.methodPieChartLabels?.find((dv: any) => dv == item?.method)) {
            this.methodPieChartLabels.push(item?.method)
          }
          const pushDataIndex = this.methodPieChartLabels.indexOf(item.method)
          if (pushDataIndex !== -1 && this.methodPieChartDatasets[0].data[pushDataIndex]) {
            this.methodPieChartDatasets[0].data[pushDataIndex] += 1
          } else {
            this.methodPieChartDatasets[0].data.push(1)
          }
        }

        const updateLocationChart = () => {
          const foundLocation = this.checkInTypes.find((cit: any) => cit.key == item?.location)?.label
          if (!this.locationPieChartLabels?.find((dv: any) => dv == (foundLocation || item?.location))) {
            this.locationPieChartLabels.push(foundLocation || item?.location)
          }
          const pushDataIndex = this.locationPieChartLabels.indexOf(foundLocation || item?.location)
          if (pushDataIndex !== -1 && this.locationPieChartDatasets[0].data[pushDataIndex]) {
            this.locationPieChartDatasets[0].data[pushDataIndex] += 1
          } else {
            this.locationPieChartDatasets[0].data.push(1)
          }
        }
        updateRatingChart()
        updateLabelChart()
        updateDeviceChart()
        updateMethodChart()
        updateLocationChart()
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
      return this.checkInTypes.find((cit: any) => cit.key == item.location)?.label || 'Chưa xác định'
    }
    if (object == 'type') {
      if (item?.tuThoiType) {
        return `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
      }
      return this.checkInEvents.find((cie: any) => cie.key == item.type)?.label || 'Chưa xác định'
    }
    return ''
  }

  onShowLog() {
    this.onShowLogClick.emit()
  }

  onUpdateJourney(item: any) {
    this.onUpdateJourneyClick.emit(item)
  }
  onRemoveJourney(item: any) {
    this.onRemoveJourneyClick.emit(item)
  }
}
