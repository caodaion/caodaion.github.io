import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { SoanSoService } from 'src/app/shared/services/soan-so/soan-so.service';

@Component({
  selector: 'app-soan-so',
  templateUrl: './soan-so.component.html',
  styleUrls: ['./soan-so.component.scss']
})
export class SoanSoComponent implements OnInit {

  isPhongLeAccessible: boolean = true
  currentUser: any;
  message: any;
  buttonSettings = <any>{};
  editData: any;
  isLoading: any;
  token: any;
  content = <any>{};
  previewContent = <any>{};
  contentEditable: boolean = true
  provinces = <any>[];
  districts = <any>[];
  filteredDistricts = <any>[];
  calculatedTuanCuu = <any>[];
  wards = <any>[];
  filteredWards = <any>[];
  defaultLocation = <any>{}

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private soanSoService: SoanSoService,
    private calendarService: CalendarService,
    private locationService: LocationService,
    private authService: AuthService,
    private decimal: DecimalPipe,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    // this.currentUser = this.authService.getCurrentUser()
    // if (this.currentUser) {
    //   if (this.currentUser.role.indexOf('phong-le') !== -1) {
    //     this.isPhongLeAccessible = true
    //   } else {
    //     this.isPhongLeAccessible = false
    //     this.message = 'Bạn cần cập nhật nhiệm vụ hành chánh có chứa PHÒNG LỄ trong cài đặt tài khoản thì mới được dùng tính năng này'
    //     this.buttonSettings.label = 'CẬP NHẬT NGAY'
    //     this.buttonSettings.link = `/@${this.currentUser.userName}`
    //   }
    // } else {
    //   this.isPhongLeAccessible = false
    //   this.message = 'Bạn cần phải đăng nhập tài khoản có phân quyền PHÒNG LỄ mới được dùng tính năng này'
    //   this.buttonSettings.label = 'ĐĂNG NHẬP NGAY'
    //   this.buttonSettings.link = '/auth/dang-nhap'
    // }
    this.route.params.subscribe((query) => {
      if (query['token']) {
        const token = query['token']
        this.token = token
        const jwtHelper = new JwtHelperService()
        const decodedToken = jwtHelper.decodeToken(token)
        this.editData = decodedToken
        this.editData.name = 'Soạn sớ'
        console.log(this.editData);
      }
    })
    this.isLoading = true
    this.getAllDivisions()
    this.getDefaultLocation()
    this.getCotnent()

    setTimeout(() => {
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
          if (state.matches) {
            localStorage.setItem(
              'currentLayout',
              JSON.stringify({
                isHideToolbar: true,
                isHideBottomNavBar: true,
              })
            );
          } else {
            localStorage.setItem(
              'currentLayout',
              JSON.stringify({
                isHideToolbar: false,
                isHideBottomNavBar: false,
              })
            );
          }
        });
    }, 0)
  }

  getDefaultLocation() {
    this.defaultLocation = <any>{}
    this.defaultLocation = JSON.parse(localStorage.getItem('defaultLocation') || '{}')
  }

  getCotnent() {
    this.content = <any>{}
    if (!this.content?.content || this.content?.content?.length === 0) {
      const initNewContent = () => {
        this.content = {
          type: 'block',
          key: this.commonService.generatedSlug(`${this.editData.soTemplate} ${this.editData.eventName} ${this.editData.subject.key}`),
          content: [],
        }
        if (!this.content.formGroup || this.content.formGroup.length == 0) {
          this.content.formGroup = []
        }
      }
      try {
        this.soanSoService.getSoTemplate(`${this.editData.longSo}/${this.editData.soTemplate}`)
          .subscribe((res: any) => {
            if (res?.data) {
              this.content = res.data
              this.content.name = `Sớ ${this.editData.eventName}`
              console.log(this.content);
              let content = JSON.stringify(this.content)
              // @ts-ignore
              content = content.replaceAll(this.token.replace('=', '').replaceAll('-', ''), '').replaceAll('%3D', '')
              let data = JSON.parse(content);
              data.content = data.content.map((item: any, index: any) => {
                return {
                  key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}`,
                  type: item.type,
                  content: item.content?.map((evn: any, i: any) => {
                    return {
                      attrs: evn.attrs,
                      content: evn.content,
                      key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}p${i}`,
                      type: evn.type,
                    }
                  }),
                }
              })
              // @ts-ignore
              data = JSON.parse(JSON.stringify(data).replaceAll(data.content[0].key.split('-')[0], this.commonService.generatedSlug(`${this.editData.soTemplate}`)))
              this.previewContent = data
              this.applyForm()
            } else {
              initNewContent()
            }
          })
      } catch (e) {
        console.log(e);
        initNewContent()
      }
    }
  }

  applyForm() {
    this.applySocVong()
    this.applyCauSieuForm()
    this.applyDefaultForm()
  }

  applySocVong() {
    if (this.editData.soTemplate.includes('so-soc-vong')) {
      if (this.editData?.eventLunar?.lunarDay === 1) {
        this.applyData('socvong', 'Sóc')
      }
      if (this.editData?.eventLunar?.lunarDay === 15) {
        this.applyData('socvong', 'Vọng')
      }
    }
  }

  applyCauSieuForm() {
    if (this.editData?.subject?.details?.name) {
      this.applyData('ho-va-ten', this.editData?.subject?.details?.name)
    }
    if (this.editData?.subject?.details?.age) {
      this.applyData('tuoi', this.commonService.convertNumberToText(this.editData?.subject?.details?.age, true))
    }
    if ((this.editData?.subject?.date?.year && this.editData?.subject?.date?.date && this.editData?.subject?.date?.month) ||
      (this.editData?.subject?.date?.lunarYear && this.editData?.subject?.date?.lunarDay && this.editData?.subject?.date?.lunarMonth)) {
      const lunarDate = this.calendarService.getConvertedFullDate(new Date(`${this.editData?.subject?.date?.year}-${this.editData?.subject?.date?.month < 10 ? '0' + this.editData?.subject?.date?.month : this.editData?.subject?.date?.month}-${this.editData?.subject?.date?.date < 10 ? '0' + this.editData?.subject?.date?.date : this.editData?.subject?.date?.date}`)).convertSolar2Lunar
      this.applyData('nam-tu-tran', this.editData?.subject?.date?.lunarYear ? this.editData?.subject?.date?.lunarYear : lunarDate.lunarYearName)
      this.applyData('thang-tu-tran', this.commonService.convertNumberToText(this.editData?.subject?.date?.lunarMonth ? this.editData?.subject?.date?.lunarMonth : lunarDate.lunarMonth, true, { type: 'month' }).toLowerCase())
      this.applyData('ngay-tu-tran', this.commonService.convertNumberToText(this.editData?.subject?.date?.lunarDay ? this.editData?.subject?.date?.lunarDay : lunarDate.lunarDay, true, { type: 'month' }).toLowerCase())
    }
    if (this.editData?.subject?.date?.lunarTime) {
      this.applyData('gio-tu-tran', this.editData?.subject?.date?.lunarTime.split('|')[0].trim())
    }
    if (this.editData.eventName) {
      this.applyData('ten-dan-cung', this.editData.eventName)
    }
    if (this.editData?.subject?.details?.holyName) {
      this.applyData('thanh-danhten', `${CAODAI_TITLE.data.find((item: any) => item.key === this.editData?.subject?.details?.title)?.name} ${this.editData?.subject?.details?.holyName}`)
    }
    if (!this.editData?.subject?.details?.holyName) {
      const foundTitle = CAODAI_TITLE.data.find((item: any) => item.key === this.editData?.subject?.details?.title)
      this.applyData('thanh-danhten', `${this.editData?.subject?.details?.job ? this.editData?.subject?.details?.job : foundTitle?.name} ${this.editData?.subject?.details?.name}`)
    }
    if (this.editData?.subject?.details?.province) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'que-quan')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        }
        foundComboLocation.value.province = this.editData?.subject?.details?.province
        if (this.content.formGroup.find((item: any) => item.key === 'que-quan')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'que-quan').value) {
            this.content.formGroup.find((item: any) => item.key === 'que-quan').value = <any>{}
          }
          this.content.formGroup.find((item: any) => item.key === 'que-quan').value.province = this.editData?.subject?.details?.province
        }
        this.applyLocation('que-quan')
      }
    }
    if (this.editData?.subject?.details?.district) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'que-quan')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        }
        foundComboLocation.value.district = this.editData?.subject?.details?.district
        if (this.content.formGroup.find((item: any) => item.key === 'que-quan')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'que-quan').value) {
            this.content.formGroup.find((item: any) => item.key === 'que-quan').value = <any>{}
          }
          this.content.formGroup.find((item: any) => item.key === 'que-quan').value.district = this.editData?.subject?.details?.district
        }
        this.applyLocation('que-quan')
      }
    }
    if (this.editData?.subject?.details?.ward) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'que-quan')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        }
        foundComboLocation.value.ward = this.editData?.subject?.details?.ward
        if (this.content.formGroup.find((item: any) => item.key === 'que-quan')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'que-quan').value) {
            this.content.formGroup.find((item: any) => item.key === 'que-quan').value = <any>{}
          }
          this.content.formGroup.find((item: any) => item.key === 'que-quan').value.ward = this.editData?.subject?.details?.ward
        }
        this.applyLocation('que-quan')
      }
    }
    if (this.editData?.subject?.details?.address) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'que-quan')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        }
        foundComboLocation.value.village = this.editData?.subject?.details?.address
        if (this.content.formGroup.find((item: any) => item.key === 'que-quan')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'que-quan').value) {
            this.content.formGroup.find((item: any) => item.key === 'que-quan').value = <any>{}
          }
          this.content.formGroup.find((item: any) => item.key === 'que-quan').value.village = this.editData?.subject?.details?.address
        }
        this.applyLocation('que-quan')
      }
    }
  }

  applyDefaultForm() {
    const namDaoFound = this.content?.formGroup?.find((item: any) => item.key === 'nam-dao')
    if (namDaoFound) {
      const currentEventDate = this.calendarService.getConvertedFullDate({
        "lunarDay": this.editData?.eventLunar?.lunarDay,
        "lunarMonth": this.editData?.eventLunar?.lunarMonth,
        "lunarYear": this.editData?.eventLunar?.lunarYear,
      }).convertLunar2Solar
      const newYearTime = this.calendarService.getConvertedFullDate({
        "lunarDay": 15,
        "lunarMonth": 10,
        "lunarYear": this.editData?.eventLunar?.lunarYear,
      }).convertLunar2Solar
      const newDateEventDate = new Date(currentEventDate[2], currentEventDate[1] - 1, currentEventDate[0])
      const newDateYearTime = new Date(newYearTime[2], newYearTime[1] - 1, newYearTime[0])      
      let calculatedDate = new Date().getFullYear() - 1926 + 1
      if (newDateEventDate >= newDateYearTime) {
        calculatedDate+=1
      }
      this.applyData('nam-dao', this.commonService.convertNumberToText(calculatedDate).toLowerCase())
    }
    if (this.editData.eventLunar.lunarYearName) {
      this.applyData('nam-am-lich', this.editData.eventLunar.lunarYearName)
    } else {
      const date = this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar
      this.applyData('nam-am-lich', date.lunarYearName)
    }
    if (this.editData.eventLunar.lunarMonth) {
      this.applyData('thang-am-lich', this.commonService.convertNumberToText(this.editData.eventLunar.lunarMonth, true, { type: 'month' }).toLowerCase())
    }
    if (this.editData.eventLunar.lunarDay) {
      this.applyData('ngay-am-lich', this.commonService.convertNumberToText(this.editData.eventLunar.lunarDay, true, { type: 'date' }).toLowerCase())
    }
    if (this.editData.eventLunar.lunarTime) {
      this.applyData('thoi', this.editData.eventLunar.lunarTime.split('|')[0].trim())
    }
    if (this.defaultLocation?.country) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'dia-chi')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        } else {
          if (typeof foundComboLocation.value === 'string') {
            foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
          }
        }
        foundComboLocation.value.country = this.defaultLocation?.country
        if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
          }
          this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.country = this.defaultLocation?.country
        }
        this.applyLocation('dia-chi')
      }
    }
    if (this.editData.eventAddress?.province) {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'dia-chi')
      if (foundComboLocation) {
        if (!foundComboLocation.value) {
          foundComboLocation.value = <any>{}
        } else {
          if (typeof foundComboLocation.value === 'string') {
            foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
          }
        }
        if (this.editData.eventAddress?.province) {
          foundComboLocation.value.province = this.editData.eventAddress?.province
        }
        if (this.editData.eventAddress?.district) {
          foundComboLocation.value.district = this.editData.eventAddress?.district
        }
        if (this.editData.eventAddress?.ward) {
          foundComboLocation.value.ward = this.editData.eventAddress?.ward
        }
        if (this.editData.eventAddress?.address) {
          foundComboLocation.value.village = this.editData.eventAddress?.address
        }
        if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
          if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
            this.previewContent.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
          }
          if (this.editData.eventAddress?.province) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.province = this.editData.eventAddress?.province
            this.previewContent.formGroup.find((item: any) => item.key === 'dia-chi').value.province = this.editData.eventAddress?.province
          }
          if (this.editData.eventAddress?.district) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.district = this.editData.eventAddress?.district
            this.previewContent.formGroup.find((item: any) => item.key === 'dia-chi').value.district = this.editData.eventAddress?.district
          }
          if (this.editData.eventAddress?.ward) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.ward = this.editData.eventAddress?.ward
            this.previewContent.formGroup.find((item: any) => item.key === 'dia-chi').value.ward = this.editData.eventAddress?.ward
          }
          if (this.editData.eventAddress?.address) {
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.village = this.editData.eventAddress?.address
            this.previewContent.formGroup.find((item: any) => item.key === 'dia-chi').value.village = this.editData.eventAddress?.address
          }
        }
        this.applyLocation('dia-chi')
      }
      if (this.defaultLocation?.called) {
        this.applyData('dia-diem', 'Gia đường')
      }
      if (this.defaultLocation?.target) {
        this.applyData('dien-tienthien-ban', 'Thiên bàn')
      }
    } else {
      if (this.defaultLocation?.province) {
        const find = (array: any, key: any) => {
          let result: any;
          array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
          return result;
        }
        const foundComboLocation = find(this.content.content, 'dia-chi')
        if (foundComboLocation) {
          if (!foundComboLocation.value) {
            foundComboLocation.value = <any>{}
          } else {
            if (typeof foundComboLocation.value === 'string') {
              foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
            }
          }
          foundComboLocation.value.province = this.defaultLocation?.province
          if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
            if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
              this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
            }
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.province = this.defaultLocation?.province
          }
          this.applyLocation('dia-chi')
        }
      }
      if (this.defaultLocation?.district) {
        const find = (array: any, key: any) => {
          let result: any;
          array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
          return result;
        }
        const foundComboLocation = find(this.content.content, 'dia-chi')
        if (foundComboLocation) {
          if (!foundComboLocation.value) {
            foundComboLocation.value = <any>{}
          } else {
            if (typeof foundComboLocation.value === 'string') {
              foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
            }
          }
          foundComboLocation.value.district = this.defaultLocation?.district
          if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
            if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
              this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
            }
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.district = this.defaultLocation?.district
          }
          this.applyLocation('dia-chi')
        }
      }
      if (this.defaultLocation?.ward) {
        const find = (array: any, key: any) => {
          let result: any;
          array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
          return result;
        }
        const foundComboLocation = find(this.content.content, 'dia-chi')
        if (foundComboLocation) {
          if (!foundComboLocation.value) {
            foundComboLocation.value = <any>{}
          } else {
            if (typeof foundComboLocation.value === 'string') {
              foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
            }
          }
          foundComboLocation.value.ward = this.defaultLocation?.ward
          if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
            if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
              this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
            }
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.ward = this.defaultLocation?.ward
          }
          this.applyLocation('dia-chi')
        }
      }
      if (this.defaultLocation?.village) {
        const find = (array: any, key: any) => {
          let result: any;
          array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
          return result;
        }
        const foundComboLocation = find(this.content.content, 'dia-chi')
        if (foundComboLocation) {
          if (!foundComboLocation.value) {
            foundComboLocation.value = <any>{}
          } else {
            if (typeof foundComboLocation.value === 'string') {
              foundComboLocation.value = JSON.parse(foundComboLocation.value || '{}')
            }
          }
          foundComboLocation.value.village = this.defaultLocation?.village
          if (this.content.formGroup.find((item: any) => item.key === 'dia-chi')) {
            if (!this.content.formGroup.find((item: any) => item.key === 'dia-chi').value) {
              this.content.formGroup.find((item: any) => item.key === 'dia-chi').value = <any>{}
            }
            this.content.formGroup.find((item: any) => item.key === 'dia-chi').value.village = this.defaultLocation?.village
          }
          this.applyLocation('dia-chi')
        }
        if (this.defaultLocation?.called) {
          this.applyData('dia-diem', this.defaultLocation?.called)
        }
        if (this.defaultLocation?.target) {
          this.applyData('dien-tienthien-ban', this.defaultLocation?.target)
        }
      }
      if (this.defaultLocation?.eventLeader) {
        this.applyData('chuc-sac-chung-dan', this.defaultLocation?.eventLeader)
      }
      this.applyData('thien-phong', this.defaultLocation?.isThienPhong)
    }
    this.cd.detectChanges()
  }

  applyLocation(id: any, prefix?: any) {
    setTimeout(() => {
      const comboLocation = document.getElementById(id)
      let value = <any>{}
      value = this.content.formGroup.find((item: any) => item.key === id).value
      comboLocation?.setAttribute('value', JSON.stringify(value))
      if (comboLocation) {
        const country = value?.country
        const province = this.provinces.find((item: any) => item.id == value.province)
        const district = this.districts.find((item: any) => item.id == value.district)
        const ward = this.wards.find((item: any) => item.id == value.ward)
        const wardName = this.wards.find((item: any) => item.id == value.ward)?.name?.replace('Phường', '')?.replace('Thị trấn', '')?.replace('Xã', '')
        if (typeof value != 'string') {
          value.mode = comboLocation.classList.contains('PpDdWwA') ? 'PpDdWwA' : comboLocation.classList.contains('pPdDwWA') ? 'pPdDwWA' : ''
          switch (value.mode) {
            case 'PpDdWwA':
              value.text = `${country ? country + ' quốc,' : ''} ${province ? province?.name?.replace('Thành phố', '')?.replace('Tỉnh', '') + ' ' +
                (province?.name?.split(province?.name?.replace('Thành phố', '')?.replace('Tỉnh', ''))[0])?.toLowerCase() : ''
                }${district ? ', ' + district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', '') + ' ' +
                  (district?.name?.split(district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', ''))[0])?.toLowerCase() : ''
                }${ward ? ', ' + (parseInt(wardName) ? 'đệ ' + this.commonService.convertNumberToText(wardName) : wardName) + ' ' +
                  (ward?.level)?.toLowerCase() : ''
                }${value.village ? ', ' + value.village : ''}`.trim()
              break;
            case 'pPdDwWA':
              value.text = value.title
              break;
            default:
              break;
          }
          comboLocation.innerHTML = `${prefix || ''} ${value.text}`
        }
      }
    }, 0)
  }

  onSaveContent(isNeedToCoppy = true) {
    let content = JSON.stringify(this.content)
    // @ts-ignore
    content = content.replaceAll(this.token.replace('=', '').replaceAll('-', ''), '').replaceAll('%3D', '')
    let data = JSON.parse(content);
    data.content = data.content.map((item: any, index: any) => {
      return {
        key: `preview-${this.commonService.generatedSlug(`${this.editData.soTemplate}`)}-${index}`,
        type: item.type,
        content: item.content?.map((evn: any, i: any) => {
          return {
            attrs: evn.attrs,
            content: evn.content,
            key: `preview-${this.commonService.generatedSlug(`${this.editData.soTemplate}`)}-${index}p${i}`,
            type: evn.type,
          }
        }),
      }
    })
    // @ts-ignore
    data = JSON.parse(JSON.stringify(data).replaceAll('preview-', ''))
    if (isNeedToCoppy) {
      console.log({ data: data });
      navigator.clipboard.writeText(JSON.stringify({ data: data }));
    }
    this.previewContent = data
  }

  onChangeSelectedIndex(event: any) {
    if (event === 1) {
      this.contentEditable = false
      this.updateCauSieuEditData()
    }
    if (event === 0) {
      this.contentEditable = true
      this.getCotnent()
    }
  }

  updateCauSieuEditData() {
    const diaChi = this.content.formGroup?.find((item: any) => item.key === 'que-quan')
    if (diaChi?.value?.province) {
      this.editData.subject.details.province = diaChi?.value?.province
    }
    if (diaChi?.value?.district) {
      this.editData.subject.details.district = diaChi?.value?.district
    }
    if (diaChi?.value?.ward) {
      this.editData.subject.details.ward = diaChi?.value?.ward
    }
    if (diaChi?.value?.village) {
      this.editData.subject.details.address = diaChi?.value?.village
    }
  }

  applyData(key: any, value: any) {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
      return result;
    }
    if (this.content.formGroup.find((item: any) => item.key === key)) {
      this.content.formGroup.find((item: any) => item.key === key).value = value
    }
    if (find(this.content.content, key)) {
      find(this.content.content, key).value = value
    }
    this.onSaveContent(false)
  }

  getAllDivisions() {
    const applyLocation = () => {
      const find = (array: any, key: any) => {
        let result: any;
        array?.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
        return result;
      }
      const foundComboLocation = find(this.content.content, 'dia-chi')
      if (foundComboLocation) {
        this.applyLocation('dia-chi')
      }
      const foundQueQuan = find(this.content.content, 'que-quan')
      if (foundQueQuan) {
        this.applyLocation('que-quan')
      }
      this.isLoading = false
    }
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
            applyLocation()
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
      applyLocation()
    }
  }

  updateFontSize(event: any) {
    this.content.fontSize = event;
    this.onSaveContent()
  }
}
