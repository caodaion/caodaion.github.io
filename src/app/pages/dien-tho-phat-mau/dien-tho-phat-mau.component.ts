import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';

@Component({
  selector: 'app-dien-tho-phat-mau',
  templateUrl: './dien-tho-phat-mau.component.html',
  styleUrls: ['./dien-tho-phat-mau.component.scss']
})
export class DienThoPhatMauComponent implements OnInit {

  user: any;

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
    // this.dienthoPhatMauService.
  }

}
