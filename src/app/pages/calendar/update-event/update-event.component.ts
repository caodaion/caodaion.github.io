import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EventService } from 'src/app/shared/services/event/event.service';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {
  googleFormsPath: any;
  selectedThanhSo: any;
  registrationGoogleFormsPath: any;
  memberThanhSo = <any>[];
  setting = <any>{};
  user = <any>{};
  newEvent = <any>{
    data: <any>{}
  };
  newRegister = <any>{
    address: <any>{}
  };
  provinces = <any>[]
  districts = <any>[]
  wards = <any>[]
  eventTypes = <any>[
    {
      group: 'Kỷ Niệm',
      data: <any>[
        {
          key: 'cau-sieu-ky-niem',
          name: 'Cầu Siêu Kỷ Niệm'
        },
        {
          key: 'cau-phuoc-ky-niem',
          name: 'Cầu Phước Kỷ Niệm'
        }
      ]
    }
  ]
  isEditor: boolean = false
  @Output('updateSelectedThanhSo') updateSelectedThanhSo = new EventEmitter()

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    // this.fetchRegisteredMember()
    // this.getAllDivisions()
  }

  fetchRegisteredMember() {
    this.eventService.fetchRegisteredMember()
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.setting = res.setting
          this.memberThanhSo = res.data
          this.checkPermission()
        }
      })
  }

  checkPermission() {
    this.isEditor = false
    this.user = this.authService.currentUser
    const foundData = this.memberThanhSo?.find((item: any) => item?.userName == this.user?.userName)
    if (foundData) {
      this.selectedThanhSo = foundData
      this.isEditor = true
    }
  }

  onUpdateSelectedThanhSo() {
    this.updateSelectedThanhSo.emit(this.selectedThanhSo?.thanhSoSheet)
  }

  onUpdateName() {
    const name = this.newRegister?.name?.trim()?.split(' ')
    let userName = ''
    if (name?.length > 1) {
      userName = this.commonService.generatedSlug(name[name.length - 1])
      name.forEach((item: any, index: any) => {
        if (index < name.length - 1) {
          userName += `${this.commonService.generatedSlug(item)[0]}`
        }
      })
      if (this.newRegister?.birthday) {
        userName += this.newRegister?.birthday?.toString()?.split('')?.splice(2, 2)?.join('')
      }
      this.newRegister.userName = userName
    }
    if (this.newRegister?.thanhSo) {
      this.newRegister.thanhSoKey = `${this.commonService.generatedSlug(this.newRegister?.thanhSo)}`
    }
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }

  getAllDivisions() {
    this.commonService.fetchProvinceData()
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.provinces = res.provinces
          this.districts = res.districts
          this.wards = res.wards
        }
      })
  }

  onRunNewEvent(isClear: boolean = false) {
    if (isClear) {
      this.newEvent = <any>{};
      this.googleFormsPath = ''
    } else {
      console.log(this.newEvent);
    }  
  }

  onRunRegistration(isClear: boolean = false) {
    if (isClear) {
      this.newRegister = <any>{};
      this.registrationGoogleFormsPath = ''
    } else {
      this.registrationGoogleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
      this.registrationGoogleFormsPath += `?${this.setting?.userName}=${encodeURIComponent(this.newRegister.userName)}`
      this.registrationGoogleFormsPath += `&${this.setting?.name}=${encodeURIComponent(this.newRegister.name)}`
      this.registrationGoogleFormsPath += `&${this.setting?.thanhSo}=${encodeURIComponent(this.newRegister.thanhSo)}`
      this.registrationGoogleFormsPath += `&${this.setting?.thanhSoKey}=${encodeURIComponent(this.newRegister.thanhSoKey)}`
      if (this.newRegister?.address) {
        this.registrationGoogleFormsPath += `&${this.setting?.address}=${encodeURIComponent(JSON.stringify(this.newRegister.address))}`
      }
      if (this.newRegister?.thanhSoSheet) {
        this.registrationGoogleFormsPath += `&${this.setting?.thanhSoSheet}=${encodeURIComponent(this.newRegister.thanhSoSheet)}`
      }
    }
  }
}
