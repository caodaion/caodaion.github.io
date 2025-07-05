import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pagenotfound',
    templateUrl: './pagenotfound.component.html',
    styleUrls: ['./pagenotfound.component.scss'],
    standalone: false
})
export class PagenotfoundComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {
  }

}
