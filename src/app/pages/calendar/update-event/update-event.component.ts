import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
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
  @Input() selectedThanhSoSetting?: any;
  @Input() selectedThanhSoEvents?: any;
  @Input() newEvent: any = {
    data: <any>{
    }
  };

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private authService: AuthService,
    private matDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.fetchRegisteredMember()
    this.getAllDivisions()    
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
      this.onUpdateSelectedThanhSo()
    }
  }

  onUpdateSelectedThanhSo() {
    this.isEditor = !!this.selectedThanhSo
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
  duplicateFound: any;
  onRunNewEvent(data: any, duplicateDialog: any) {
    this.duplicateFound = null
    if (data == true) {
      this.newEvent = <any>{};
      this.googleFormsPath = ''
    } else {
      if (this.selectedThanhSoSetting?.googleFormsId) {
        const foundData = this.selectedThanhSoEvents?.find((item: any) => item?.key == data?.key)
        this.duplicateFound = foundData
        if (this.duplicateFound) {
          const duplicateDialogRef = this.matDialog.open(duplicateDialog);
        } else {
          this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.selectedThanhSoSetting?.googleFormsId}/viewform`
          this.googleFormsPath += `?${this.selectedThanhSoSetting?.key}=${encodeURIComponent(data.key)}`
          this.googleFormsPath += `&${this.selectedThanhSoSetting?.eventName}=${encodeURIComponent(data.eventName)}`
          this.googleFormsPath += `&${this.selectedThanhSoSetting?.eventType}=${encodeURIComponent(data.eventType)}`
          this.googleFormsPath += `&${this.selectedThanhSoSetting?.data}=${encodeURIComponent(JSON.stringify(data.data))}`
        }
      }
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
  onUpdateEventType(event: any) {
    let keyData = `${this.newEvent.data.eventTime ? this.newEvent.data.eventTime?.split('|')[0]?.trim() : ''}${this.newEvent.data.date || ''}${this.newEvent.data.month || ''}${this.newEvent.data.year || ''}${this.newEvent.data.eventDate || ''}${this.newEvent.data.eventMonth || ''}${this.newEvent?.data?.time ? this.newEvent?.data?.time?.split('|')[0]?.trim() : ''}${this.newEvent?.eventType?.name || ''}`
    this.newEvent.key = this.commonService.generatedSlug(keyData)
    this.newEvent.eventName = `${this.newEvent?.eventType?.name}`
  }
}
