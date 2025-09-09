import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  @Input() prevPage: any = '..';
  current: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.current = {
      title: 'Chia sẻ ngay',
      location: location.href,
    }
  }

  onClickBackButton() {
    if (this.prevPage?.navigate?.link) {
      this.router
        .navigate([this.prevPage?.navigate?.link], {
          queryParams: this.prevPage?.navigate?.queryParams,
        });
    } else {
      const path = location.pathname.split('/')
      path.pop()
      this.router
        .navigate([path.join('/')], {
          queryParams: this.prevPage?.navigate?.queryParams,
        });
    }
  }

}
