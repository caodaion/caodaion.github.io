import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {

  url: any
  endPath: any
  countDown: any
  seconds: any = 5

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.url = params['url'];
      this.URLHandle()
    });
  }

  URLHandle() {
    const fixedURL = (url: any) => {
      if (url?.includes('http')) {
        if (!url?.includes('://')) {
          url = url?.replace(':/', '://')
        }
      }
      return url;
    }
    try {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(this.url)
      this.url = fixedURL(decodedToken)
    } catch (e) {
      console.log(e);
    }
    if (this.url?.includes('http')) {
      this.endPath = this.url
    }
    if (this.url.includes(location.origin)) {
      this.goToEndUrl()
    } else {
      this.countDown = timer(0, 1000).pipe(
        map(n => (this.seconds - n) * 1000),
        takeWhile(n => n >= 0),
      )
      this.countDown?.subscribe((n: any) => {
        if (n === 0) {
          this.goToEndUrl()
        }
      })
    }
  }

  goToEndUrl() {
    function validURL(str: any) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(str);
    }
    if (validURL(this.endPath)) {
      // location.href = `${this.endPath}`;
      window.open(`${this.endPath}`)
    }
  }
}
