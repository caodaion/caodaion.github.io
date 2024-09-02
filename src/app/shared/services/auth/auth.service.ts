import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { MENU } from '../../constants/menu.constant';
import { Observable } from 'rxjs';
import { SheetService } from '../sheet/sheet.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CAODAI_TITLE } from '../../constants/master-data/caodai-title.constant';
import { CommonService } from '../common/common.service';
import * as moment from 'moment';
import { CalendarService } from '../calendar/calendar.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  readonly sheetId = `2PACX-1vTVylQUa5KMibyzg_FrMFza-iF8Mk0IrJ9GrCEkNhClDFiO6DTIeB_tmp1JemzEbHh1jfaAt5eqjfUm`
  readonly userWorkbook: any;
  readonly personalWorkbook: any;
  readonly userSetting: any;
  readonly personalSetting: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sheetService: SheetService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private decimalPipe: DecimalPipe,
    private calendarService: CalendarService
  ) {
  }

  public currentUser: any;
  private currentUserRemote: any;
  public contentEditable: boolean = false;
  jwtHelper = new JwtHelperService();
  mainModuleKey = <any>[]
  pushedModules = <any>[]
  isInvalidSyncData: boolean = false;

  public getCurrentUser(isLogIn: boolean = false): Observable<any> {
    return new Observable((observable) => {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key.includes(key) ? o : find(o.children || [], key));
        return result;
      }
      let token: any = localStorage.getItem('token')
      this.currentUser = this.jwtHelper.decodeToken(token);
      switch (this.currentUser?.role) {
        case 'administrator':
        case 'editor':
          this.contentEditable = true;
          break;
        default:
          break;
      }
      if (this.currentUser?.role?.length > 0) {
        this.pushedModules = []
        this.mainModuleKey = []
        if (typeof this.currentUser?.role === 'string') {
          this.currentUser.role = JSON.parse(this.currentUser.role)
        }
        this.currentUser.role = [... new Set(this.currentUser?.role?.map((item: any) => {
          if (item?.includes('pho-quan-ly-')) {
            return item?.replace('pho-quan-ly-', '')
          }
          if (item?.includes('quan-ly-')) {
            return item?.replace('quan-ly-', '')
          }
          return item
        }))]
        this.currentUser?.role?.forEach((item: any) => {
          const foundModule = find(MENU, item)
          if (foundModule && !this.pushedModules?.find((pm: any) => pm?.includes(foundModule?.key))) {
            this.pushedModules.push(foundModule.key)
            const foundManiModule = this.mainModuleKey?.length > 0 ? this.mainModuleKey?.find((mmk: any) => mmk?.key === foundModule?.key?.split('.')[0]) : null
            const foundMainModuleMENU = MENU?.find((mmk: any) => mmk?.key === foundModule?.key?.split('.')[0])
            if (!foundManiModule) {
              if (foundMainModuleMENU) {
                const pushMainMENU = {
                  key: foundMainModuleMENU.key,
                  url: foundMainModuleMENU.url,
                  label: foundMainModuleMENU.label,
                  icon: foundMainModuleMENU.icon,
                  fullAssess: foundMainModuleMENU.fullAssess,
                  released: foundMainModuleMENU.released,
                  children: <any>[]
                }
                pushMainMENU.children.push(foundModule)
                this.mainModuleKey.push(pushMainMENU)
              }
            } else {
              if (!foundManiModule.children?.find((fmm: any) => fmm.key === foundModule?.key)) {
                foundManiModule.children.push(foundModule)
              }
            }
          }
        })
        this.currentUser.children = this.mainModuleKey
      }
      // this.contentEditable = true;    
      if (this.currentUser?.sheetId) {
        this.getUserPersionalData(isLogIn).subscribe((res: any) => {
          this.currentUser.setting = res.setting
          this.currentUser.vocabularies = res.remote?.vocabularies
          this.currentUser.vocabularyExercises = res.remote?.vocabularyExercises
          this.currentUser.congPhu = res.remote?.congPhu
          this.currentUser.consecutive = res.remote?.consecutive
          this.currentUser.consecutiveFrom = res.remote?.consecutiveFrom
          this.currentUserRemote = res.remote;
          this.isInvalidSyncData = this.checkSyncDataStatus();
          observable.next(this.currentUser);
          observable.complete();
        });
      } else {
        observable.next(this.currentUser);
        observable.complete();
      }
    });
  }

  checkSyncDataStatus(): boolean {
    if (this.checktoUpdate()) {
      return true;
    }
    return false;
  }

  checktoUpdate() {
    let currentUserKeys = Object.keys(this.currentUser);
    let currentUserRemoteKeys = Object.keys(this.currentUserRemote);
    const autoMatchedKeys = [
      'vocabularies',
      'vocabularyExercises',
      'vocabulary',
      'vocabularyExercise',
      'cong-phu',
      'congPhu',
      'fontSize',
    ]
    currentUserKeys = currentUserKeys?.map((item: any) => {
      if (autoMatchedKeys?.includes(item)) {
        return "MATCHED";
      }
      if (item == "children" || (JSON.stringify(this.currentUser[item]) == JSON.stringify(this.currentUserRemote[item]))) {
        return "MATCHED";
      }
      return "UN-MATCHED";
    })
    currentUserRemoteKeys = currentUserRemoteKeys?.map((item: any) => {
      if (autoMatchedKeys?.includes(item)) {
        return "MATCHED";
      }
      if (item == "children" || (JSON.stringify(this.currentUserRemote[item]) == JSON.stringify(this.currentUser[item]))) {
        return "MATCHED";
      }
      return "UN-MATCHED";
    })
    return !(currentUserKeys?.filter((item: any) => item == 'UN-MATCHED')?.length > 0 ||
      currentUserRemoteKeys?.filter((item: any) => item == 'UN-MATCHED')?.length > 0);
  }

  compareData(): Observable<any> {
    return new Observable((observable) => {
      const currentUserKeys = Object.keys((this.currentUser));
      const response = <any>{};
      response.data = <any>[]
      currentUserKeys?.forEach((key: any) => {
        if (key != 'children') {
          const startCompare = () => {
            if (this.currentUserRemote[key]?.toString() != this.currentUser[key]?.toString()) {
              const comparedData = {
                key: key,
                label: this.getCompareData(key, this.currentUser[key])?.label,
                currentDisplayData: this.getCompareData(key, this.currentUser[key])?.displayData || this.currentUser[key],
                remoteDisplayData: this.getCompareData(key, this.currentUserRemote[key])?.displayData || this.currentUserRemote[key],
                currentData: this.currentUser[key],
                remoteData: this.currentUserRemote[key],
                load: 'upload'
              }
              response.data.push(comparedData);
            }
          }
          if (key.includes('province') || key.includes('district') || key.includes('ward')) {
            if (this.commonService.provinces?.length === 0) {
              this.commonService.fetchProvinceData()
                .subscribe((res: any) => {
                  if (res?.status == 200) {
                    this.provinces = res.provinces
                    this.districts = res.districts
                    this.wards = res.wards
                    startCompare();
                  }
                })
            } else {
              this.provinces = this.commonService.provinces
              this.districts = this.commonService.districts
              this.wards = this.commonService.wards
              startCompare();
            }
          } else {
            startCompare();
          }
        }
      })
      observable.next(response)
      observable.complete()
    });
  }

  provinces: any;
  districts: any;
  wards: any;

  getCompareData(key: any, item: any): any {
    switch (key) {
      case 'sex': return {
        label: 'Giới tính',
        displayData: item === 'male' ? "Nam" : item === 'female' ? "Nữ" : '',
      }
      case 'title': return {
        label: 'Chức Đạo',
        displayData: CAODAI_TITLE?.data?.find((v: any) => v.key === item)?.name,
      }
      case 'birthday': return {
        label: 'Ngày sinh',
        displayData: this.datePipe.transform(item, 'dd/MM/YYYY'),
      }
      case 'thanhSo': return {
        label: 'Thánh Sở',
        displayData: item,
      }
      case 'role': {
        const titles = CAODAI_TITLE?.data?.find((item: any) => item.key === 'chuc-viec')?.subTitle
        return {
          label: 'Nhiệm vụ hành chánh',
          displayData: item?.map((it: any) => titles?.find((t: any) => t.key == it)?.name).join(', '),
        }
      }
      case 'children': {
        const titles = CAODAI_TITLE?.data?.find((item: any) => item.key === 'chuc-viec')?.subTitle
        return {
          label: 'Khả ngăn truy cập',
          displayData: "Cập nhật dựa theo nhiệm vụ hành chánh của bạn",
        }
      }
      case 'province': {
        return {
          label: 'Tỉnh/Thành phố',
          displayData: this.provinces?.find((p: any) => p?.id == item)?.name,
        }
      }
      case 'district': {
        return {
          label: 'Quận/Huyện',
          displayData: this.districts?.find((p: any) => p?.id == item)?.name,
        }
      }
      case 'ward': {
        return {
          label: 'Phường/Xã',
          displayData: this.wards?.find((p: any) => p?.id == item)?.name,
        }
      }
      case 'village': {
        return {
          label: 'Thôn/Lộ',
          displayData: item,
        }
      }
      case 'phone': {
        return {
          label: 'Số điện thoại/Zalo',
          displayData: item,
        }
      }
      case 'password': {
        return {
          label: 'Mật khẩu',
          displayData: item?.split('')?.map((psw: any) => "*").join(''),
        }
      }
      case 'name': {
        return {
          label: 'Họ và Tên',
          displayData: item,
        }
      }
      case 'color': {
        return {
          label: 'Sắc phái',
          displayData: item == 'thai' ? 'Thái' : item == 'thuong' ? 'Thượng' : item == 'ngoc' ? 'Ngọc' : '',
        }
      }
      case 'holyName': {
        console.log(item);
        return {
          label: 'Thánh danh',
          displayData: item,
        }
      }
      default: return '';
    }
  }

  getUserPersionalData(isLogIn: boolean = false): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        const response = <any>{}
        this.sheetService.decodeRawSheetData(ref.personalWorkbook.Sheets['Form Responses 1'])
          .subscribe((res: any) => {
            if (res?.length > 0) {
              response.status = 200;
              response.setting = <any>{}
              const settings = res?.filter((item: any) => item['Timestamp'] === 'setting')
              response.setting = { data: settings[0]['data'] }
              ref.personalSetting = response.setting
              response.remote = <any>{
                userName: this.currentUser?.userName,
                isCloudSynced: this.currentUser?.isCloudSynced,
                sheetId: this.currentUser?.sheetId,
                googleFormsId: this.currentUser?.googleFormsId,
                setting: response.setting,
              }
              res?.forEach((item: any) => {
                if (item.data && item['Timestamp'] !== 'setting') {
                  const dataRow = JSON.parse(item.data)
                  dataRow?.forEach((dr: any) => {
                    if (dr?.key) {
                      if (isLogIn) {
                        this.currentUser[dr?.key] = dr?.data;
                      }
                      switch (dr?.key) {
                        case 'vocabulary':
                          if (!response.remote['vocabularies']) {
                            response.remote['vocabularies'] = <any>[]
                          }
                          response.remote['vocabularies'].push(dr?.data);
                          break;
                        case 'vocabularyExercise':
                          if (!response.remote['vocabularyExercises']) {
                            response.remote['vocabularyExercises'] = <any>[]
                          }
                          dr?.data?.forEach((ved: any) => {
                            response.remote['vocabularyExercises'].push(ved);
                          })
                          break;
                        case 'cong-phu':
                          if (!response.remote['congPhu']) {
                            response.remote['congPhu'] = <any>[]
                          }
                          const dateValue = new Date(`${dr?.data?.year}-${this.decimalPipe.transform(dr?.data?.month, '2.0-0')}-${this.decimalPipe.transform(dr?.data?.date, '2.0-0')}`)
                          const foundDate = response.remote['congPhu']?.find((cp: any) => cp.date == dr?.data?.date && cp.month == dr?.data?.month && cp.year == dr?.data?.year)
                          if (new Date(new Date().setHours(0)) >= new Date(dateValue.setHours(0))) {
                            if (parseInt(dr?.data?.time?.split(':')[0]) >= 23) {
                              const nextDate = new Date(moment(moment(new Date(`${dr?.data?.year}-${this.decimalPipe.transform(dr?.data?.month, '2.0-0')}-${this.decimalPipe.transform(dr?.data?.date, '2.0-0')} 00:00:00`)).add(1, 'days')).format('YYYY-MM-DD 00:00:00'))
                              const foundNextDate = response.remote['congPhu']?.find((cp: any) => cp.date == parseInt(moment(nextDate).format('DD')) && cp.month == parseInt(moment(nextDate).format('MM')) && cp.year == parseInt(moment(nextDate).format('YYYY')))
                              if (!foundNextDate) {
                                response.remote['congPhu'].push({
                                  date: parseInt(moment(nextDate).format('DD')),
                                  month: parseInt(moment(nextDate).format('MM')),
                                  year: parseInt(moment(nextDate).format('YYYY')),
                                  dateTime: nextDate,
                                  data: [{
                                    time: dr?.data?.time,
                                    date: dr?.data?.date,
                                    month: dr?.data?.month,
                                    year: dr?.data?.year,
                                    focus: dr?.data?.focus,
                                    quality: dr?.data?.quality,
                                    note: dr?.data?.note,
                                  }]
                                });
                              } else {
                                response.remote['congPhu'][response.remote['congPhu'].indexOf(foundNextDate)].data.push({
                                  time: dr?.data?.time,
                                  date: dr?.data?.date,
                                  month: dr?.data?.month,
                                  year: dr?.data?.year,
                                  focus: dr?.data?.focus,
                                  quality: dr?.data?.quality,
                                  note: dr?.data?.note,
                                })
                              }
                            } else {
                              if (foundDate) {
                                response.remote['congPhu'][response.remote['congPhu'].indexOf(foundDate)].data.push({
                                  time: dr?.data?.time,
                                  date: dr?.data?.date,
                                  month: dr?.data?.month,
                                  year: dr?.data?.year,
                                  focus: dr?.data?.focus,
                                  quality: dr?.data?.quality,
                                  note: dr?.data?.note,
                                })
                              } else {
                                response.remote['congPhu'].push({
                                  date: dr?.data?.date,
                                  month: dr?.data?.month,
                                  year: dr?.data?.year,
                                  dateTime: new Date(`${dr?.data?.year}-${this.decimalPipe.transform(dr?.data?.month, '2.0-0')}-${this.decimalPipe.transform(dr?.data?.date, '2.0-0')} 00:00:00`),
                                  data: [{
                                    time: dr?.data?.time,
                                    date: dr?.data?.date,
                                    month: dr?.data?.month,
                                    year: dr?.data?.year,
                                    focus: dr?.data?.focus,
                                    quality: dr?.data?.quality,
                                    note: dr?.data?.note,
                                  }]
                                });
                              }
                            }
                            response.remote['congPhu'].sort((a: any, b: any) => {
                              return new Date(`${a?.year}-${this.decimalPipe.transform(a?.month, '2.0-0')}-${this.decimalPipe.transform(a?.date, '2.0-0')}`) < new Date(`${b?.year}-${this.decimalPipe.transform(b?.month, '2.0-0')}-${this.decimalPipe.transform(b?.date, '2.0-0')}`) ? -1 : 1
                            })
                            response.remote['congPhu']?.forEach((csec: any, index: any) => {
                              const previousDate = new Date(`${response.remote['congPhu'][index - 1]?.year}-${this.decimalPipe.transform(response.remote['congPhu'][index - 1]?.month, '2.0-0')}-${this.decimalPipe.transform(response.remote['congPhu'][index - 1]?.date, '2.0-0')} 00:00:00`)
                              const compareDate = new Date(`${csec?.year}-${this.decimalPipe.transform(csec?.month, '2.0-0')}-${this.decimalPipe.transform(csec?.date, '2.0-0')} 00:00:00`)
                              const diff = parseInt(moment(previousDate?.toString() === 'Invalid Date' ? compareDate : previousDate).diff(compareDate, 'days').toString().replace('-', ''))
                              if (diff === 0 || diff === 1) {
                                if (compareDate <= new Date()) {
                                  if (!response.remote['consecutiveFrom']) {
                                    response.remote['consecutiveFrom'] = {
                                      solar: new Date(compareDate.setDate(compareDate.getDate() - 1)),
                                      lunar: this.calendarService.getConvertedFullDate(new Date(compareDate.setDate(compareDate.getDate() - 1)))?.convertSolar2Lunar
                                    }
                                  }
                                }
                              } else {
                                response.remote['consecutiveFrom'] = null
                              }
                            })
                            if (!response.remote['consecutiveFrom']) {
                              response.remote['consecutiveFrom'] = {
                                solar: new Date(),
                                lunar: this.calendarService.getConvertedFullDate(new Date())?.convertSolar2Lunar
                              };
                            }
                            response.remote['consecutive'] = moment(new Date()).diff(moment(response.remote['consecutiveFrom']?.solar).subtract(1, 'days'), 'days')
                          }
                          break;
                        default:
                          response.remote[dr?.key] = dr?.data;
                          break;
                      }
                    }
                  })
                }
              })
              observable.next(response)
              observable.complete()
            }
          })
      }
      if (!ref.personalWorkbook) {
        try {
          this.sheetService.fetchSheet(this.currentUser.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.personalWorkbook = res?.workbook
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
  }

  getMenu(menu: any, mainMenu?: any) {
    let result = menu?.map((item: any) => {
      if (item?.released) {
        if (item?.voViWorkspace) {
          if (this.currentUser?.voViWorker) {
            return item
          }
          return undefined
        } else {
          if (item?.fullAssess) {
            return item
          } else {
            if (this.currentUser?.children?.length == 1 && this.currentUser?.children[0].key === 'any') {
              return item
            } else {
              const getPage = (children: any) => {
                return children?.find((page: any) => page.key === item.key)
              }
              if (getPage(this.currentUser?.children)) {
                return item
              } else {
                if (mainMenu?.children.find((page: any) => page.key == item.key)) {
                  return item
                }
              }
            }
          }
        }
      }
    })?.filter((item: any) => item !== undefined)
    if (location.pathname.split('/').length <= 2) {
      if (!location.pathname.includes('trang-chu') && !location.pathname.includes('qr') && !location.pathname.includes('firebase-cloud-messaging-push-scope')) {
        // this.router.navigate([result[0]?.key?.replaceAll('.', '/')])
      }
    }
    return result
  }

  fetchUsers(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        const response = <any>{}
        this.sheetService.decodeRawSheetData(ref.userWorkbook.Sheets['settings'])
          .subscribe((res: any) => {
            if (res?.length > 0) {
              response.status = 200;
              response.setting = <any>{}
              res?.forEach((item: any) => {
                response.setting[item?.field] = item?.trigger;
              })
              ref.userSetting = response.setting
              this.sheetService.decodeRawSheetData(ref.userWorkbook.Sheets['caodaionUsers'])
                .subscribe((res: any) => {
                  response.users = <any>[]
                  res?.forEach((item: any) => {
                    response.users.push(item)
                  })
                })
            }
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.userWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.userWorkbook = res?.workbook
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
  }
}
