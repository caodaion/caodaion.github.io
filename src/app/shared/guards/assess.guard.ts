import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import {AuthService} from "../shared/services/auth/auth.service";
import {Observable} from "rxjs";
import {MENU} from "../constants/menu.constant";

@Injectable()
export class AssessGuard  {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const find = (array: any, key: any) => {
      let result: any;
      array?.some((o: any) => result = o.key === key ? o : find(o.children || [], key));
      return result;
    }
    // @ts-ignore
    let path = state.url.slice(1, state.url.length)?.split('?')[0]?.replaceAll('/', '.')
    console.log(path)
    if (!find(MENU, path)) {
      return true
    }
    if (find(this.authService.currentUser?.children, path)) {
      return true
    }
    this.router.navigate([`/${state.url.split('/')[1]}`]);
    return false
  }
}
