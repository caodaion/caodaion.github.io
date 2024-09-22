import { Component, Input, OnInit } from '@angular/core';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];
  @Input() data: any = <any>[];

  reportFromDate: any;
  reportToDate: any;

  constructor(private dienThoPhatMauService: DienThoPhatMauService) {

  }


  ngOnInit(): void {
    this.reportFromDate = new Date(moment().startOf('month').format('YYYY-MM-DD'))
    this.reportToDate = new Date(moment().endOf('month').format('YYYY-MM-DD'))
  }

  onExportToExcel() {
    this.dienThoPhatMauService.exportToExcel({ dateFrom: this.reportFromDate, dateTo: this.reportToDate }).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete')
      }
    })

  }
}
