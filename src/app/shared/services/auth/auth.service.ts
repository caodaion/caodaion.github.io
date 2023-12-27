import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { MENU } from '../../constants/menu.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
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
    this.contentEditable = true;
    return this.currentUser;
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
}
