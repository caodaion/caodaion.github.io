import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { MENU } from '../../constants/menu.constant';
import { Observable } from 'rxjs';
import { SheetService } from '../sheet/sheet.service';

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

  constructor(private http: HttpClient, private router: Router, private sheetService: SheetService) {
  }

  public currentUser: any;
  public contentEditable: boolean = false;
  jwtHelper = new JwtHelperService();
  mainModuleKey = <any>[]
  pushedModules = <any>[]

  public getCurrentUser() {
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
      this.getUserPersionalData().subscribe((res: any) => {
        this.currentUser.setting = res.setting
      });
    } else {
    }
    return this.currentUser;
  }

  getUserPersionalData(): Observable<any> {
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
            }
            observable.next(response)
            observable.complete()
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
