import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  public currentUser: any;
  public contentEditable: boolean = false;
  jwtHelper = new JwtHelperService();

  public getCurrentUser() {
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
    // this.contentEditable = true;
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
      if (!location.pathname.includes('trang-chu') && !location.pathname.includes('qr')) {
        this.router.navigate([result[0]?.key?.replaceAll('.', '/')])
      }
    }
    return result
  }
}
