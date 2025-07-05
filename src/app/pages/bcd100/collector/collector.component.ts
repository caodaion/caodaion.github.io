import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Bcd100Service } from 'src/app/shared/services/bcd100/bcd100.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
    selector: 'app-collector',
    templateUrl: './collector.component.html',
    styleUrls: ['./collector.component.scss'],
    standalone: false
})
export class CollectorComponent implements OnInit {
  provinces = <any>[];
  districts = <any>[];
  wards = <any>[];
  thanhSoData = <any>{
    founders: <any>[
      <any>{}
    ],
    leaders: <any>[
      <any>{}
    ],
    fourClassOfDignities: <any>[
      <any>{}
    ],
    buildings: <any>[
      {
        name: 'Bửu điện',
        isNotExist: false,
      },
      {
        name: 'Thiên Phong Đường',
        isNotExist: false,
      },
      {
        name: 'Phòng thuốc Đông Y',
        isNotExist: false,
      },
      {
        name: 'Các công trình phụ khác',
        isNotExist: false,
      },
    ],
    workers: <any>[
      {
        role: 'Ban Đầu Họ Đạo',
      },
      {
        role: 'Hội Trưởng',
      },
      {
        role: 'Phó Hội Trưởng',
      },
      {
        role: 'Phó Hội Trưởng Nữ',
      },
      {
        role: 'QL Phòng Thơ',
      },
      {
        role: 'P. QL Phòng Thơ',
      },
      {
        role: 'QL Phòng Lễ',
      },
      {
        role: 'P. QL Phòng Lễ',
      },
      {
        role: 'QL Phòng Lương',
      },
      {
        role: 'P. QL Phòng Lương',
      },
      {
        role: 'QL Phòng Công',
      },
      {
        role: 'P. QL Phòng Công',
      },
      {
        role: 'Chánh Trị Sự',
      },
      {
        role: 'Thông Sự',
      },
      {
        role: 'Phó Trị Sự nam',
      },
      {
        role: 'Chánh Trị sự nữ',
      },
      {
        role: 'Phó Trị Sự nữ',
      },
      {
        role: 'Ban Hành Thiện',
      },
      {
        role: 'Phái viên Nhơn sanh',
      },
    ]
  }
  googleFormsPath: any;
  bcd100Setting: any;

  constructor(
    private commonService: CommonService,
    private matDialog: MatDialog,
    private bcd100Service: Bcd100Service
  ) {

  }

  ngOnInit(): void {
    this.getAllDivisions()
  }

  getAllDivisions() {
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
    }
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }

  addMorePerson() {
    if (!this.thanhSoData?.founders || this.thanhSoData?.founders?.length === 0) {
      this.thanhSoData.founders = [];
    }
    this.thanhSoData.founders?.push(<any>{});
  }

  addMoreLeader() {
    if (!this.thanhSoData?.leaders || this.thanhSoData?.leaders?.length === 0) {
      this.thanhSoData.leaders = [];
    }
    this.thanhSoData.leaders?.push(<any>{});
  }

  addMoreWorker() {
    if (!this.thanhSoData?.workers || this.thanhSoData?.workers?.length === 0) {
      this.thanhSoData.workers = [];
    }
    this.thanhSoData.workers?.push(<any>{});
  }

  addMoreClassOfDignity() {
    if (!this.thanhSoData?.fourClassOfDignities || this.thanhSoData?.fourClassOfDignities?.length === 0) {
      this.thanhSoData.fourClassOfDignities = [];
    }
    this.thanhSoData.fourClassOfDignities?.push(<any>{});
  }

  onRemovePerson(index: any) {
    this.thanhSoData.founders[index] = null
    this.thanhSoData.founders = this.thanhSoData.founders?.filter((item: any) => !!item)
  }

  onRemoveLeader(index: any) {
    this.thanhSoData.leaders[index] = null
    this.thanhSoData.leaders = this.thanhSoData.leaders?.filter((item: any) => !!item)
  }

  onRemoveWorker(index: any) {
    this.thanhSoData.workers[index] = null
    this.thanhSoData.workers = this.thanhSoData.workers?.filter((item: any) => !!item)
  }

  generateKey() {
    return this.commonService.generatedSlug(`${this.thanhSoData?.currentName || ''} ${this.thanhSoData?.province || ''}${this.thanhSoData?.district || ''}${this.thanhSoData?.ward || ''}${this.thanhSoData?.address || ''}`)
  }

  onRemoveFourPerson(index: any) {
    this.thanhSoData.fourClassOfDignities[index] = null
    this.thanhSoData.fourClassOfDignities = this.thanhSoData.fourClassOfDignities?.filter((item: any) => !!item)
  }

  onSave(submitDialog: any) {
    const startSave = () => {
      if (this.bcd100Setting?.googleFormsId) {
        this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.bcd100Setting?.googleFormsId}/viewform`
        this.googleFormsPath += `?${this.bcd100Setting?.key}=${encodeURIComponent(this.generateKey())}`
        this.googleFormsPath += `&${this.bcd100Setting?.data}=${encodeURIComponent(JSON.stringify(this.thanhSoData))}`
        const submitDialogRef = this.matDialog.open(submitDialog);
      }
    }
    if (this.bcd100Service.bcd100Setting?.googleFormsId) {
      this.bcd100Setting = this.bcd100Service.bcd100Setting
      startSave()
    } else {
      this.bcd100Service.fetchBcd100Data().subscribe({
        next: (res: any) => {
          this.bcd100Setting = res.setting;
          startSave()
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.info('complete');
        },
      })
    }
  }
}
