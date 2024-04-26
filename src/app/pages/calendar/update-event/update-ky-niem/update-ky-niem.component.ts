import { Component, Input, OnInit } from '@angular/core';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
  selector: 'app-update-ky-niem',
  templateUrl: './update-ky-niem.component.html',
  styleUrls: ['./update-ky-niem.component.scss']
})
export class UpdateKyNiemComponent implements OnInit {
  @Input('newEvent') newEvent?: any;
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

  constructor(private calendarService: CalendarService) {
    this.timeZone = TIME_TYPE.data
  }

  ngOnInit(): void {
    this.onUpdateInfomation()
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
    this.getCalculatedLunarDate()
    this.newEvent.name = `${this.newEvent?.eventType?.name || 'cúng'} cho ${selectedTitle && this.newEvent.data.sex && selectedTitle?.howToAddress ? selectedTitle?.howToAddress[this.newEvent.data.sex] : ''} ${this.subTitles.find((item: any) => item?.key === this.newEvent.data.subTitle)?.name || ''} ${this.newEvent.data.holyName ? `${selectedTitle?.name} ${this.newEvent.data.holyName}` : (this.newEvent.data.name || '')}`
    console.log(this.newEvent);
  }

  getCalculatedLunarDate() {
    const calculatedLunarDate = this.calendarService.getConvertedFullDate(new Date(`${this.newEvent.data?.year}-${this.newEvent.data?.month < 10 ? '0' + this.newEvent.data?.month : this.newEvent.data?.month}-${this.newEvent.data?.date < 10 ? '0' + this.newEvent.data?.date : this.newEvent.data?.date}T${this.newEvent.data?.time ? this.newEvent.data?.time + ':00' : '00:00:00'}`)).convertSolar2Lunar
    this.newEvent.data.lunarTime = calculatedLunarDate?.lunarTime || ''
    this.newEvent.data.calculatedLunarDate = `${calculatedLunarDate.lunarTime ? 'Thời ' + calculatedLunarDate.lunarTime : ''} | ${calculatedLunarDate.lunarDay < 10 ? '0' + calculatedLunarDate.lunarDay : calculatedLunarDate.lunarDay}/${calculatedLunarDate.lunarMonth < 10 ? '0' + calculatedLunarDate.lunarMonth : calculatedLunarDate.lunarMonth}${calculatedLunarDate.lunarLeap ? 'N' : ''}/${calculatedLunarDate.lunarYearName}`
  }
}
