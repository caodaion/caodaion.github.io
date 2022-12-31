import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() prevPage: any = '..';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
    ) {}

  ngOnInit(): void {}

  onClickBackButton() {
    if (this.prevPage?.navigate?.link) {
      this.router
        .navigate([this.prevPage?.navigate?.link], {
          queryParams: this.prevPage?.navigate?.queryParams,
        });
    }
  }
}
