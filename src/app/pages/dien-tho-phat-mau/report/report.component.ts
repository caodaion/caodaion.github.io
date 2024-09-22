import { Component, Input, OnInit } from '@angular/core';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';
import * as moment from 'moment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

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
  totalReport: any;
  materialImportSummaryData = <any>[]
  materialTypeData = <any>[]
  filteredData = <any>[]

  constructor(
    private dienThoPhatMauService: DienThoPhatMauService,
    private calendarService: CalendarService
  ) {

  }


  ngOnInit(): void {
    this.reportFromDate = new Date(moment().startOf('month').format('YYYY-MM-DD'))
    this.reportToDate = new Date(moment().endOf('month').format('YYYY-MM-DD'))
    this.updateData();
  }

  updateData() {
    this.filteredData = this.data
      ?.filter((item: any) => new Date(item.logFrom) <= this.reportToDate && new Date(item.logFrom) >= this.reportFromDate)
      ?.sort((a: any, b: any) => new Date(a?.logFrom) < new Date(b?.logFrom) ? -1 : 1)
    console.log('%cthis.filteredData', 'font-size: 30px', this.filteredData);
    this.updateMaterialImportSummaryData()
    this.updateMaterialType()
  }

  updateMaterialImportSummaryData() {
    this.materialImportSummaryData = <any>[]
    this.filteredData?.forEach((item: any) => {
      item.lunar = this.calendarService.getConvertedFullDate(new Date(item.logFrom)).convertSolar2Lunar
      const foundDate = this.materialImportSummaryData.find((ed: any) => ed?.logFrom === item.logFrom)
      if (foundDate) {
        foundDate.bills.push(item)
      } else {
        this.materialImportSummaryData.push({
          logFrom: item?.logFrom,
          lunar: item?.lunar,
          bills: <any>[item]
        })
      }
    })
    this.materialImportSummaryData.forEach((item: any) => {
      item.totalPriceDate = item?.bills?.map((bi: any) => bi?.billToTalPrice)?.reduce((a: any, b: any) => a + b, 0)
    });
    console.log(this.materialImportSummaryData);
    this.totalReport = this.materialImportSummaryData?.map((bi: any) => bi?.totalPriceDate)?.reduce((a: any, b: any) => a + b, 0)
  }

  updateMaterialType() {
    this.materialTypeData = <any>[]
    console.log(this.materialTypeData);
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
