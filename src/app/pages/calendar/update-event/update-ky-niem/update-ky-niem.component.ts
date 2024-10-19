import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-update-ky-niem',
  templateUrl: './update-ky-niem.component.html',
  styleUrls: ['./update-ky-niem.component.scss']
})
export class UpdateKyNiemComponent implements OnInit {
  @Input('newEvent') newEvent?: any = <any>{};
  @Input('selectedThanhSo') selectedThanhSo?: any;
  @Input('showSaveButton') showSaveButton: boolean = true;
  @Output('onRunNewEvent') onRunNewEvent = new EventEmitter();
  caoDaiTitle = CAODAI_TITLE.data
  isHolyNameRequired: boolean = false;
  subTitles: any;
  colors = <any>[
    {
      key: 'thai',
      name: 'Thái',
      color: '#fbbc05'
    },
    {
      key: 'thuong',
      name: 'Thượng',
      color: '#4285f4'
    },
    {
      key: 'ngoc',
      name: 'Ngọc',
      color: '#ea4335'
    }
  ];
  timeZone = <any>[]
  provinces = <any>[]
  districts = <any>[]
  wards = <any>[]

  constructor(private commonService: CommonService) {
    this.timeZone = TIME_TYPE.data
  }

  ngOnInit(): void {    
    this.newEvent.data.atThanhSo = true
    this.onUpdateInfomation()
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
          if (!this.newEvent.data.eventAddress) {
            this.newEvent.data.eventAddress = <any>{}
          }
          if (!this.newEvent.data.address) {
            this.newEvent.data.address = <any>{}
          }
        }
      })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
      if (!this.newEvent.data.eventAddress) {
        this.newEvent.data.eventAddress = <any>{}
      }
      if (!this.newEvent.data.address) {
        this.newEvent.data.address = <any>{}
      }
    }
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }

  onUpdateInfomation() {
    this.isHolyNameRequired = this.caoDaiTitle.find((item: any) => item.key === this.newEvent.data.title)?.isHolyNameRequired || false
    let selectedTitle: any = this.caoDaiTitle.find((item: any) => item.key === this.newEvent.data.title);
    this.subTitles = []
    this.newEvent.data.holyName = ''
    if (selectedTitle?.subTitle) {
      this.subTitles = selectedTitle?.subTitle
    }
    if (this.newEvent.data.name) {
      if (this.isHolyNameRequired) {
        if (this.newEvent.data.sex === 'male') {
          if (this.newEvent.data.color) {
            this.newEvent.data.holyName = `${this.colors.find((item: any) => item.key === this.newEvent.data.color)?.name} ${this.newEvent.data.name?.trim()?.split(' ')[this.newEvent.data.name?.trim()?.split(' ').length - 1]} Thanh`
          }
        }
        if (this.newEvent.data.sex === 'female') {
          this.newEvent.data.holyName = `Hương ${this.newEvent.data.name?.trim()?.split(' ')[this.newEvent.data.name?.trim()?.split(' ').length - 1]}`
        }
      }
    }
    this.newEvent.data.eventSummary = `Sự kiện ${this.newEvent?.eventType?.name || 'cúng'} cho ${selectedTitle && this.newEvent.data.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[this.newEvent.data.sex] : ''} ${this.subTitles.find((item: any) => item?.key === this.newEvent.data.subTitle)?.name || ''} ${this.newEvent.data.holyName ? `${selectedTitle?.name} ${this.newEvent.data.holyName} (${this.newEvent.data.name})` : (this.newEvent.data.name || '')} ${this.newEvent.data.age ? this.newEvent.data.age + ' tuổi' : ''}`
    let keyData = `${this.newEvent.data.eventTime ? this.newEvent.data.eventTime?.split('|')[0]?.trim() : ''}${this.newEvent.data.date || ''}${this.newEvent.data.month || ''}${this.newEvent.data.year || ''}${this.newEvent.data.eventDate || ''}${this.newEvent.data.eventMonth || ''}${this.newEvent?.data?.time ? this.newEvent?.data?.time?.split('|')[0]?.trim() : ''}${this.newEvent?.eventType?.name || ''} ${this.subTitles.find((item: any) => item?.key === this.newEvent.data.subTitle)?.name || ''} ${this.newEvent.data.holyName ? `${selectedTitle?.name} ${this.newEvent.data.holyName}` : (this.newEvent.data.name || '')} ${this.newEvent.data.age ? this.newEvent.data.age : ''}`
    this.newEvent.key = this.commonService.generatedSlug(keyData)
    this.newEvent.eventName = `${this.newEvent?.eventType?.name || 'cúng'} cho ${selectedTitle && this.newEvent.data.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[this.newEvent.data.sex] : ''} ${this.subTitles.find((item: any) => item?.key === this.newEvent.data.subTitle)?.name || ''} ${this.newEvent.data.holyName ? `${selectedTitle?.name} ${this.newEvent.data.holyName}` : (this.newEvent.data.name || '')}`
  }

  updateNewEvent() {
    const requestPayload = {
      key: this.newEvent?.key,
      eventType: this.newEvent?.eventType?.key,
      eventName: this.newEvent?.eventName?.replaceAll('  ', ' '),
      data: <any>{
        address: this.newEvent?.data?.address,
        eventDate: this.newEvent?.data?.eventDate,
        eventMonth: this.newEvent?.data?.eventMonth,
        eventTime: this.newEvent?.data?.eventTime?.split('|')[0]?.trim(),
        holyName: this.newEvent?.data?.holyName,
        name: this.newEvent?.data?.name,
        age: this.newEvent?.data?.age,
        sex: this.newEvent?.data?.sex,
        title: this.newEvent?.data?.title,
        subTitle: this.newEvent?.data?.subTitle,
        color: this.newEvent?.data?.color,
        date: this.newEvent?.data?.date,
        month: this.newEvent?.data?.month,
        year: this.newEvent?.data?.year,
        time: this.newEvent?.data?.time?.split('|')[0]?.trim(),
      }
    }
    this.onRunNewEvent.emit(requestPayload)
  }
}
