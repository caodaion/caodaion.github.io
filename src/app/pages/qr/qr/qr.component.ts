import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TinyUrlService } from 'src/app/shared/services/tiny-url/tiny-url.service';

@Component({
    selector: 'app-qr',
    templateUrl: './qr.component.html',
    styleUrls: ['./qr.component.scss'],
    standalone: false
})
export class QrComponent implements OnInit {

  url: any
  endPath: any
  countDown: any
  seconds: any = 5
  setting = <any>{}
  shorts = <any>[]

  constructor(private route: ActivatedRoute, private tinyUrlService: TinyUrlService) {

  }

  getShortLinkSetting() {
    const returnData = () => {
      const foundData = this.shorts?.find((item: any) => item?.id == this.url)
      if (foundData?.data) {
        this.endPath = foundData?.data
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
    if (this.setting?.googleForms && this.setting?.id && this.setting?.data && this.shorts?.length > 0) {
      returnData()
    } else {
      this.tinyUrlService.fetchShort()?.subscribe((res: any) => {
        if (res.status === 200) {
          this.setting = res.setting
          this.shorts = res.shorts          
          returnData()
        }
      })
    }
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
      this.getShortLinkSetting()
    }
    if (this.url?.includes('http')) {
      this.endPath = this.url
    }
    if (this.url.includes(location.origin)) {
      this.goToEndUrl()
    } else {
    }
  }

  goToEndUrl() {
    function validURL(str: any) {
      try { return Boolean(new URL(str)); }
      catch (e) { return false; }
    }
    if (validURL(this.endPath)) {
      window.open(`${this.endPath}`, '_blank');
    }
  }
}
