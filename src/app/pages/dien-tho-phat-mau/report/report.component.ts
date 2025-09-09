import { AfterViewInit, Component, Input } from '@angular/core';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';
import moment from 'moment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    standalone: false
})
export class ReportComponent implements AfterViewInit {

  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];
  @Input() data: any = <any>[];

  reportFromDate: any;
  reportToDate: any;
  totalImportReport: any;
  totalMaterialReport: any;
  materialImportSummaryData = <any>[]
  materialTypeData = <any>[]
  filteredData = <any>[]
  filterByMaterial: any;

  constructor(
    private dienThoPhatMauService: DienThoPhatMauService,
    private calendarService: CalendarService
  ) {

  }


  ngAfterViewInit(): void {
    this.reportFromDate = new Date(moment().startOf('month').format('yyyy-MM-DD'))
    this.reportToDate = new Date(moment().endOf('month').format('yyyy-MM-DD'))
    this.updateData();
  }

  updateData() {
    if (this.reportToDate && this.reportFromDate) {
      this.filteredData = this.data
        ?.filter((item: any) => new Date(`${item.logFrom}`) <= new Date(new Date(this.reportToDate).setDate(new Date(this.reportToDate).getDate() + 1)) && new Date(`${item.logFrom}`) >= this.reportFromDate)
        ?.sort((a: any, b: any) => new Date(a?.logFrom) < new Date(b?.logFrom) ? -1 : 1)
      this.updateMaterialImportSummaryData()
      this.updateMaterialType()
    }
  }

  updateMaterialImportSummaryData() {
    this.materialImportSummaryData = <any>[]
    this.filteredData?.forEach((item: any) => {
      const pushData = JSON.parse(JSON.stringify(item))
      pushData.lunar = this.calendarService.getConvertedFullDate(new Date(pushData.logFrom)).convertSolar2Lunar
      const foundDate = this.materialImportSummaryData.find((ed: any) => ed?.logFrom === pushData.logFrom)
      if (foundDate) {
        foundDate.bills.push(pushData)
      } else {
        this.materialImportSummaryData.push({
          logFrom: pushData?.logFrom,
          lunar: pushData?.lunar,
          bills: <any>[pushData]
        })
      }
    })
    this.materialImportSummaryData.forEach((item: any) => {
      item.totalPriceDate = item?.bills?.map((bi: any) => bi?.billToTalPrice)?.reduce((a: any, b: any) => a + b, 0)
    });
    this.totalImportReport = this.materialImportSummaryData?.map((bi: any) => bi?.totalPriceDate)?.reduce((a: any, b: any) => a + b, 0)
  }
  filteredDataPrice: any;
  updateMaterialType() {
    this.materialTypeData = <any>[]
    this.filteredDataPrice = <any>[]
    const priceList = <any>[]
    this.filteredData?.forEach((item: any) => {
      item?.materials?.forEach((material: any) => {
        if (!this.filteredDataPrice?.find((fdp: any) => fdp === material?.materialObject?.name)) {
          this.filteredDataPrice.push(material?.materialObject?.name)
        }
        if (this.filterByMaterial?.length > 0) {
          if (this.filterByMaterial?.includes(material?.materialObject?.name)) {
            priceList.push(<any>{
              name: material?.materialObject?.name,
              unit: material?.materialObject?.unit,
            })
          }
        } else {
          priceList.push(<any>{
            name: material?.materialObject?.name,
            unit: material?.materialObject?.unit,
          })
        }
      })
    })
    this.filteredDataPrice = this.filteredDataPrice?.filter((item: any) => !!item?.replaceAll(' ', ''))
    priceList?.forEach((priceItem: any) => {
      const foundPriceMaterial = this.materialTypeData?.find((mtd: any) => mtd?.name === priceItem?.name)
      if (!foundPriceMaterial) {
        let matchMaterialPrice = <any>[]
        this.filteredData?.forEach((fd: any) => {
          const pushFilter = JSON.parse(JSON.stringify(fd))
          const materialPrice = pushFilter?.materials?.filter((fdm: any) => fdm?.materialObject?.name === priceItem?.name)
          if (materialPrice?.length > 0) {
            materialPrice?.forEach((mpfd: any) => {
              const pushData: any = JSON.parse(JSON.stringify(mpfd))
              pushData.billId = pushFilter?.id;
              pushData.logFrom = pushFilter?.logFrom;
              matchMaterialPrice.push(pushData)
            })
          }
        })
        if (matchMaterialPrice?.length > 0) {
          this.materialTypeData.push(<any>{
            name: priceItem?.name,
            unit: priceItem?.unit,
            materialPrice: matchMaterialPrice
          })
        }
      }
    })
    this.materialTypeData?.forEach((item: any) => {
      if (!item?.totalMaterialCount) {
        item.totalMaterialCount = 0
      }
      if (!item?.totalMaterialPrice) {
        item.totalMaterialPrice = 0
      }

      item?.materialPrice?.forEach((imp: any) => {
        item.totalMaterialPrice += imp?.totalPrice
        item.totalMaterialCount += parseFloat(imp?.number)
      })
    })
    this.totalMaterialReport = this.materialTypeData?.map((bi: any) => bi?.totalMaterialPrice)?.reduce((a: any, b: any) => a + b, 0)
  }

  onExportToExcel() {
    this.dienThoPhatMauService.exportToExcel(
      {
        dateFrom: this.reportFromDate,
        dateTo: this.reportToDate,
        materialImportSummarySheet: {
          materialImportSummaryData: this.materialImportSummaryData,
          totalImportReport: this.totalImportReport,
        },
        materialTypeSheet: {
          materialTypeData: this.materialTypeData,
          totalMaterialReport: this.totalMaterialReport,
        },
      }).subscribe({
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
