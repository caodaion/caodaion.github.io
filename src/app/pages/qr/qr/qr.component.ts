import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile, timer } from 'rxjs';

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
    this.endPath = this.url
    if (this.url.includes(location.origin)) {
      window.location.href = `${this.endPath}`;
    } else {
      this.countDown = timer(0, 1000).pipe(
        map(n => (this.seconds - n) * 1000),
        takeWhile(n => n >= 0),
      )
      this.countDown?.subscribe((n: any) => {
        if (n === 0) {
          window.location.href = `${this.endPath}`;
        }
      })
    }
  }

  goToEndUrl() {
    window.location.href = `${this.endPath}`;
  }
}
