import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: false
})
export class AuthComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  token: any = null;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      if (query['token']) {
        this.token = this.jwtHelper.decodeToken(query['token']);
        if (this.token) {
          // @ts-ignore
          if (this.token.redirectTo) {
            // @ts-ignore
            let redirectTo: any = this.token.redirectTo;
            this.router.navigate([redirectTo]);
          }
          // @ts-ignore
          if (this.token) {
            // localStorage.setItem('currentUser', JSON.stringify(this.token));
          }
        }
      }
    });
  }
}
