import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() prevPage: any = '..';
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onClickBackButton() {
    this.router
      .navigate([this.prevPage?.navigate?.link], {
        relativeTo: this.route,
        queryParams: this.prevPage?.navigate?.queryParams,
      });
  }
}
