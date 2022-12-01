import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {Observable} from "rxjs";


@Injectable()
export class VoviGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.authService.currentUser.voViWorker) {
      return true
    }
    this.router.navigate([`/${state.url.split('/')[1]}`]);
    return false
  }
}
