import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';

@Component({
  selector: 'app-dien-tho-phat-mau',
  templateUrl: './dien-tho-phat-mau.component.html',
  styleUrls: ['./dien-tho-phat-mau.component.scss']
})
export class DienThoPhatMauComponent implements OnInit {

  user: any;
  setting: any;
  price: any;
  data: any;

  constructor(
    private authService: AuthService,
    private dienthoPhatMauService: DienThoPhatMauService
  ) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .subscribe({
        next: (res: any) => {
          this.user = res
          this.getDienThoPhatMauData();
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.log('completed');
        },
      })
  }

  getDienThoPhatMauData() {
    this.dienthoPhatMauService.fetchDienThoPhatMauData()
    .subscribe({
      next: (res: any) => {
        this.setting = res.setting
        this.data = res.data
        this.price = res.price.sort((a: any, b: any) => {
          return new Date(a?.logFrom) > new Date(b?.logFrom) ? -1 : 1
        })
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('completed');
      },
    })
  }
}
