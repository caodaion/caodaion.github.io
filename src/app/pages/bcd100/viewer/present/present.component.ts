import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-present',
  templateUrl: './present.component.html',
  styleUrls: ['./present.component.scss']
})
export class PresentComponent implements OnInit {
  @Input('data') data: any;
  provinces: any = <any>[];
  districts: any = <any>[];
  wards: any = <any>[];
  isLoadingDivisions: boolean = false;

  constructor(private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.getAllDivisions()
  }

  getAllDivisions() {
    this.isLoadingDivisions = true
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
            this.isLoadingDivisions = false
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
      this.isLoadingDivisions = false
    }
  }

  getFullAddress(item: any) {
    let fullAddress = ''
    if (item?.data?.address) {
      fullAddress += item?.data?.address
    }
    if (item?.data?.ward) {
      fullAddress += ` ${this.wards?.find((ward: any) => ward?.id == item?.data?.ward)?.name}`
    }
    if (item?.data?.district) {
      fullAddress += ` ${this.districts?.find((district: any) => district?.id == item?.data?.district)?.name}`
    }
    if (item?.data?.province) {
      fullAddress += ` ${this.provinces?.find((province: any) => province?.id == item?.data?.province)?.name}`
    }
    return fullAddress
  }



  onPrint() {
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      '<html><head><title>' + document.title.toUpperCase() + `PRINTER</title><style>
      
body {
    margin: 0;
    font-size: 11px;
}

p {
    margin: 0;
    font-size: 11px;
}

.paragraphTitle {
    font-size: 13px;
    font-weight: 600;
}

.printPage {
    min-width: 210mm;
    width: 210mm;
    min-height: 297mm;
    height: 297mm;
    max-height: 297mm;
    overflow: hidden;
    background-color: white;
}

.imageWrapper {
    width: 100%;
    height: 100%;
    aspect-ratio: 20/9;
    overflow: hidden;
    border-radius: 6px;
}
      </style>`
    );
    printTab?.document.write(`</head><body>`);
    const printContent = document.getElementById(
      `BCD100PRINT`
    );
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      // @ts-ignore
      writeContent.innerHTML = printContent?.outerHTML;
      // @ts-ignore
      writeContent.childNodes[0].style.padding = 0;
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }
}
