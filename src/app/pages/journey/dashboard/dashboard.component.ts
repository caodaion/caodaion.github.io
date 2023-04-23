import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'ng2-charts-demo';
  public isShowChart: boolean = true
  // Pie
  public ratingPieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public ratingPieChartLabels = ["Hoàn toàn không", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"];
  public ratingPieChartDatasets = [{
    data: [0, 0, 0, 0, 0]
  }];
  public ratingPieChartLegend = true;
  public ratingPieChartPlugins = [];

  constructor() {
    this.getData()
  }

  getData() {
    this.isShowChart = false
    const localStorageData = JSON.parse(localStorage.getItem('journey') || '[]')
    console.log(localStorageData);
    let data = [0, 0, 0, 0, 0]
    if (localStorageData?.length > 0) {
      localStorageData?.forEach((item: any) => {
        switch (item.rating) {
          case 1: data[0] += 1
            break;
          case 2: data[1] += 1
            break;
          case 3: data[2] += 1
            break;
          case 4: data[3] += 1
            break;
          case 5: data[4] += 1
            break;
          default:
            break;
        }
      })
      this.ratingPieChartDatasets[0].data = data
      setTimeout(() => {
        this.isShowChart = true
      }, 0)
    }
    console.log(data);

  }

}
