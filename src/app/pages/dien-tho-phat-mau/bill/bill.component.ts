import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];
  @Input() data: any = <any>[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  addedData: any = <any>{
    materials: <any>[]
  }
  googleFormPath: any;
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  durationInSeconds = 3;

  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe,
    private _snackBar: MatSnackBar
  ) {

  }

  ngAfterViewInit(): void {
    if (this.addedData?.materials?.length === 0) {
      this.addedData?.materials.push(<any>{})
    }
    this.cd.detectChanges()
  }

  ngOnInit(): void {
    this.getYearOptions()
    const now = new Date()
    this.addedData.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.addedData.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.addedData.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
  }

  getYearOptions() {
    for (let i = new Date().getFullYear() + 1; i > new Date().getFullYear() - 5; i--) {
      const convertedDate = this.calendarService.getConvertedFullDate(new Date(new Date().setFullYear(i)))
      this.yearOptions.push({
        solar: convertedDate.convertSolar2Lunar.lunarYear,
      })
    }
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1)
    this.dayOptions = Array.from({ length: 31 }, (x, i) => i + 1)
  }

  onSave() {
    this.googleFormPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
    this.addedData.key = `${this.commonService.generatedSlug(this.addedData?.id)}_${this.addedData?.year}${this.decimalPipe.transform(this.addedData?.month, '2.0-0')}${this.decimalPipe.transform(this.addedData?.date, '2.0-0')}`
    let requestPayload = <any>{}
    requestPayload = JSON.parse(JSON.stringify(this.addedData))
    requestPayload.materials = requestPayload?.materials?.map((item: any) => {
      const returnData = <any>{
        number: item?.number,
      }
      if (item?.material?.key === 'dynamic-sli') {
        returnData.material = item?.material
      } else {
        returnData.material = item?.material?.key
      }
      return returnData
    })
    const syncToken = [
      { key: 'bill', data: requestPayload }
    ]
    this.googleFormPath += `?${this.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
    this.googleFormPath += `&${this.setting?.logFrom}=${this.addedData?.year}-${this.decimalPipe.transform(this.addedData?.month, '2.0-0')}-${this.decimalPipe.transform(this.addedData?.date, '2.0-0')}`;
    this.googleFormPath += `&${this.setting?.updatedBy}=${this.user.userName}`;
  }

  getBillToTalPrice(bill?: any): any {
    let billToTalPrice = 0
    if (!bill) {
      this.addedData?.materials?.forEach((item: any) => {
        billToTalPrice += item?.totalPrice
      });
    } else {
      bill?.materials?.forEach((item: any) => {
        item.totalPrice = parseFloat(item?.number) * parseFloat(item?.material?.price)
        billToTalPrice += item?.totalPrice
      });
      bill.billToTalPrice = billToTalPrice
    }
    return billToTalPrice;
  }

  clear() {
    this.googleFormPath = ''
    this.addedData = <any>{}
    const now = new Date()
    this.addedData.materials = <any>[<any>{}]
    this.addedData.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.addedData.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.addedData.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
  }

  getMaterialData(material: any): any {
    let unitPrice = ''
    let totalPrice = 0
    if (material?.material) {
      unitPrice = `${this.currencyPipe.transform(material.material?.price, 'VND')}${material.material?.unit ? '/' + material.material?.unit : ''}`
    }
    if (material?.material && material?.number) {
      totalPrice = parseFloat(material?.material?.price) * parseFloat(material?.number)
    }
    material.unitPrice = unitPrice
    material.totalPrice = totalPrice
    return {
      unitPrice: unitPrice,
      totalPrice: totalPrice,
    }
  }

  removeMaterial(materialIndex: any) {
    this.addedData.materials[materialIndex] = null
    this.addedData.materials = this.addedData.materials?.filter((item: any) => !!item)
  }

  addMaterial() {
    this.addedData?.materials?.forEach((item: any) => {
      item.inValid = false
      item.inValid = item?.totalPrice === 0
    })
    if (this.addedData?.materials?.filter((item: any) => item?.inValid)?.length === 0) {
      this.addedData.materials?.push(<any>{})
    } else {
      this._snackBar.open('Phát hiện một vật liệu chưa tính ra thành tiền', 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  isExpanedAll: boolean = false;

  expanAll() {
    this.isExpanedAll = !this.isExpanedAll
    this.data?.forEach((item: any) => {
      item.expaned = this.isExpanedAll
    })
  }
}
