import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.scss'],
    standalone: false
})
export class PriceComponent implements OnInit {

  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];

  addedData: any = <any>{}
  googleFormPath: any;
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  orderBy: any = 'name'
  isAsc: boolean = true
  edittingItem: any
  deleteGoogleFormPath: any;
  @ViewChild('deletePriceDialog') deletePriceDialog!: any;
  @ViewChild('savePriceDialog') savePriceDialog!: any;

  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {

  }

  ngAfterViewInit(): void {
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

  onSave(savedData: any) {
    this.googleFormPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
    const syncToken = <any>[
      { key: 'update-price' }
    ]
    if (!savedData.key) {
      savedData.key = `${this.commonService.generatedSlug(savedData?.name)}_${savedData?.year}${this.decimalPipe.transform(savedData?.month, '2.0-0')}${this.decimalPipe.transform(savedData?.date, '2.0-0')}`
      syncToken[0].key = 'price'
    }
    syncToken[0].data = savedData
    this.googleFormPath += `?${this.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
    this.googleFormPath += `&${this.setting?.logFrom}=${savedData?.year}-${this.decimalPipe.transform(savedData?.month, '2.0-0')}-${this.decimalPipe.transform(savedData?.date, '2.0-0')}`;
    this.googleFormPath += `&${this.setting?.updatedBy}=${this.user.userName}`;
    const savePriceDialogRef = this.matDialog.open(this.savePriceDialog)
    savePriceDialogRef.afterClosed().subscribe(() => {
      this.googleFormPath = ''
      this.edittingItem = <any>{}
      this.clear()
    })
  }

  clear() {
    this.googleFormPath = ''
    this.addedData = <any>{}
    const now = new Date()
    this.addedData.date = parseInt(this.datePipe.transform(now, 'dd') || '0')
    this.addedData.month = parseInt(this.datePipe.transform(now, 'MM') || '0')
    this.addedData.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0')
  }

  deletePrice(item: any) {
    this.deleteGoogleFormPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
    const syncToken = [
      { key: 'delete-price', data: { key: item?.key } }
    ]
    this.deleteGoogleFormPath += `?${this.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
    this.deleteGoogleFormPath += `&${this.setting?.logFrom}=${this.addedData?.year}-${this.decimalPipe.transform(this.addedData?.month, '2.0-0')}-${this.decimalPipe.transform(this.addedData?.date, '2.0-0')}`;
    this.deleteGoogleFormPath += `&${this.setting?.updatedBy}=${this.user.userName}`;
    const deletePriceDialogRef = this.matDialog.open(this.deletePriceDialog)
    deletePriceDialogRef.afterClosed().subscribe(() => {
      this.deleteGoogleFormPath = ''
    })
  }

  editPrice(item: any) {
    this.edittingItem = item
  }
}
