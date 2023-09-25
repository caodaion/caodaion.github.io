import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {Observable} from "rxjs";
import {MENU} from "../constants/menu.constant";


@Injectable()
export class ReleasedGuard  {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.children || [], key));
      return result;
    }
    // @ts-ignore
    let path = state.url.slice(1, state.url.length)?.split('?')[0]?.replaceAll('/', '.')
    if (!find(MENU, path)) {
      return true
    }
    // @ts-ignore
    if (!find(MENU, path) && (find(MENU, path?.split('.').slice(0, path.split('.').length - 1)?.join().replaceAll(',', '.'))?.released || find(MENU, path?.split('.').slice(0, path.split('.').length - 2)?.join().replaceAll(',', '.'))?.released)) {
      return true
    }
    if (find(MENU, path)?.released) {
      return true
    }
    console.log(!find(MENU, path))
    // @ts-ignore
    this.router.navigate([`/${path?.split('.').slice(0, path.split('.').length - 1)?.join().replaceAll(',', '/')}`]);
    return false
  }
}
