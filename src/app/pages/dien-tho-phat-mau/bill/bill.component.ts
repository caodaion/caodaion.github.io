import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];
  @Input() data: any = <any>[];
  rawPrice: any = <any>[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  deleteGoogleFormPath: any;
  @ViewChild('deleteBillDialog') deleteBillDialog!: any;
  @ViewChild('saveBillDialog') saveBillDialog!: any;

  addedData: any = <any>{
    materials: <any>[
      <any>{
        material: <any>{
          price: '',
          unit: '',
        },
      },
    ],
  };
  googleFormPath: any;
  yearOptions = <any>[];
  monthOptions = <any>[];
  dayOptions = <any>[];
  durationInSeconds = 3;
  orderBy: any = 'logFrom';
  isAsc: boolean = true;
  edittingItem: any = <any>{};

  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.rawPrice = JSON.parse(JSON.stringify(this.price));
    if (this.addedData?.materials?.length === 0) {
      this.addedData?.materials.push(<any>{
        material: <any>{
          price: '',
          unit: '',
        },
      });
    }
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.getYearOptions();
    const now = new Date();
    this.addedData.date = parseInt(this.datePipe.transform(now, 'dd') || '0');
    this.addedData.month = parseInt(this.datePipe.transform(now, 'MM') || '0');
    this.addedData.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0');
  }

  getYearOptions() {
    
    this.monthOptions = Array.from({ length: 12 }, (x, i) => i + 1);
    this.dayOptions = Array.from({ length: 31 }, (x, i) => i + 1);
  }

  onSave(savedData: any) {
    this.googleFormPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`;
    const syncToken = <any>[<any>{ key: 'update-bill' }];
    console.log(savedData);

    savedData?.materials?.forEach((materialItem: any) => {
      const foundMaterial = this.rawPrice?.find(
        (rp: any) => rp?.key === materialItem?.material?.key
      );
      if (
        parseFloat(materialItem?.material?.price) !==
          parseFloat(foundMaterial?.price) ||
        materialItem?.material?.unit !== foundMaterial?.unit ||
        materialItem?.material?.provider !== foundMaterial?.provider
      ) {
        syncToken.push({
          key: 'update-price',
          data: {
            date: materialItem?.material?.date,
            key: materialItem?.material?.key,
            logFrom: materialItem?.material?.logFrom,
            month: materialItem?.material?.month,
            name: materialItem?.material?.name,
            price: materialItem?.material?.price,
            provider: materialItem?.material?.provider,
            unit: materialItem?.material?.unit,
            updatedBy: this.user.userName,
            year: materialItem?.material?.year,
          },
        });
      }
    });
    if (!savedData?.key) {
      savedData.key = `${this.commonService.generatedSlug(savedData?.id)}_${
        savedData?.year
      }${this.decimalPipe.transform(
        savedData?.month,
        '2.0-0'
      )}${this.decimalPipe.transform(savedData?.date, '2.0-0')}`;
      syncToken[0].key = 'bill';
    }
    let requestPayload = <any>{};
    requestPayload = JSON.parse(JSON.stringify(savedData));
    requestPayload.materials = requestPayload?.materials?.map((item: any) => {
      const returnData = <any>{
        number: item?.number,
      };
      if (item?.material?.key === 'dynamic-sli') {
        returnData.material = item?.material;
      } else {
        returnData.material = item?.material?.key;
      }
      return returnData;
    });
    const newRequestPayload = JSON.parse(JSON.stringify(requestPayload))
    delete newRequestPayload.billToTalPrice;
    delete newRequestPayload.Timestamp;
    syncToken[0].data = newRequestPayload;
    console.log(requestPayload);
    
    this.googleFormPath += `?${this.setting?.data}=${encodeURIComponent(
      JSON.stringify(syncToken)
    )}`;
    this.googleFormPath += `&${this.setting?.logFrom}=${
      savedData?.year
    }-${this.decimalPipe.transform(
      savedData?.month,
      '2.0-0'
    )}-${this.decimalPipe.transform(savedData?.date, '2.0-0')}`;
    this.googleFormPath += `&${this.setting?.updatedBy}=${this.user.userName}`;
    const saveBillDialogRef = this.matDialog.open(this.saveBillDialog);
    saveBillDialogRef.afterClosed().subscribe(() => {
      this.googleFormPath = '';
      this.clear();
    });
  }

  getBillToTalPrice(bill?: any): any {
    return {
      count: bill?.materials?.length,
    };
  }

  clear() {
    this.googleFormPath = '';
    this.addedData = <any>{};
    const now = new Date();
    this.addedData.materials = <any>[
      <any>{
        material: <any>{
          price: '',
          unit: '',
        },
      },
    ];
    this.addedData.date = parseInt(this.datePipe.transform(now, 'dd') || '0');
    this.addedData.month = parseInt(this.datePipe.transform(now, 'MM') || '0');
    this.addedData.year = parseInt(this.datePipe.transform(now, 'YYYY') || '0');
  }

  getMaterialData(material: any): any {
    let unitPrice = '';
    let totalPrice = 0;
    if (material?.material) {
      unitPrice = `${this.currencyPipe.transform(
        material.material?.price,
        'VND'
      )}${material.material?.unit ? '/' + material.material?.unit : ''}`;
    }
    if (material?.material && material?.number) {
      totalPrice =
        parseFloat(material?.material?.price) * parseFloat(material?.number);
    }
    return {
      unitPrice: unitPrice,
      totalPrice: totalPrice,
    };
  }

  removeMaterial(materialIndex: any) {
    this.addedData.materials[materialIndex] = null;
    this.addedData.materials = this.addedData.materials?.filter(
      (item: any) => !!item
    );
  }

  addMaterial() {
    this.addedData?.materials?.forEach((item: any) => {
      item.inValid = false;
      item.inValid = item?.totalPrice === 0;
    });
    if (
      this.addedData?.materials?.filter((item: any) => item?.inValid)
        ?.length === 0
    ) {
      this.addedData.materials?.push(<any>{
        material: <any>{
          price: '',
          unit: '',
        },
      });
    } else {
      this._snackBar.open(
        'Phát hiện một vật liệu chưa tính ra thành tiền',
        'Đóng',
        {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        }
      );
    }
  }

  isExpanedAll: boolean = false;

  expanAll() {
    this.isExpanedAll = !this.isExpanedAll;
    this.data?.forEach((item: any) => {
      item.expaned = this.isExpanedAll;
    });
  }

  deleteBill(item: any) {
    this.deleteGoogleFormPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`;
    this.addedData.key = `${this.commonService.generatedSlug(
      this.addedData?.id
    )}_${this.addedData?.year}${this.decimalPipe.transform(
      this.addedData?.month,
      '2.0-0'
    )}${this.decimalPipe.transform(this.addedData?.date, '2.0-0')}`;
    const syncToken = [{ key: 'delete-bill', data: { key: item?.key } }];
    this.deleteGoogleFormPath += `?${this.setting?.data}=${encodeURIComponent(
      JSON.stringify(syncToken)
    )}`;
    this.deleteGoogleFormPath += `&${this.setting?.logFrom}=${
      this.addedData?.year
    }-${this.decimalPipe.transform(
      this.addedData?.month,
      '2.0-0'
    )}-${this.decimalPipe.transform(this.addedData?.date, '2.0-0')}`;
    this.deleteGoogleFormPath += `&${this.setting?.updatedBy}=${this.user.userName}`;
    const deleteBillDialogRef = this.matDialog.open(this.deleteBillDialog);
    deleteBillDialogRef.afterClosed().subscribe(() => {
      this.deleteGoogleFormPath = '';
    });
  }

  editBill(item: any) {
    if (!item?.materials || !item?.materials[0].material) {
      item.materials = <any>[
        <any>{
          material: <any>{
            material: <any>{},
          },
        },
      ];
    }
    console.log(item);

    this.addedData = item;
    this.addedData?.materials?.forEach((material: any) => {
      material.material = material.materialObject;
    });
    console.log(this.addedData);
  }
}
