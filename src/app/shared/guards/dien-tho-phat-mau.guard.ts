import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MENU } from '../constants/menu.constant';
import { AuthService } from '../services/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DienThoPhatMauGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return new Observable((observable: any) => {
      this.authService.getCurrentUser()
        .subscribe({
          next: (res: any) => {
            if (res?.userName === 'nhannt98' || res?.userName === 'annt90') {
              observable.next(true)
            } else {
              observable.next(false)
              location.reload()
            }
          },
          error: (error: any) => {
            console.log(error);
            observable.next(false);
            location.reload()
          },
          complete: () => {
            console.log('completed');
          },
        })
    })

  }
}
