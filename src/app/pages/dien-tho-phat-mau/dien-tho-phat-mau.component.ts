import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';

@Component({
  selector: 'app-dien-tho-phat-mau',
  templateUrl: './dien-tho-phat-mau.component.html',
  styleUrls: ['./dien-tho-phat-mau.component.scss']
})
export class DienThoPhatMauComponent implements AfterViewInit {

  user: any;
  setting: any;
  price: any;
  data: any;
  isActiveModule: boolean = false;

  constructor(
    private authService: AuthService,
    private dienthoPhatMauService: DienThoPhatMauService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.isActiveModule = false
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
          setTimeout(() => {
            this.setting = res.setting
            this.data = res.data
            this.price = res.price.sort((a: any, b: any) => {
              return new Date(a?.logFrom) > new Date(b?.logFrom) ? -1 : 1
            })
            this.data?.forEach((item: any) => {
              item?.materials?.forEach((material: any) => {
                if (material?.material && material?.number) {
                  material.totalPrice = parseFloat(material?.material?.price) * parseFloat(material?.number)
                }
              })
              let billToTalPrice = 0
              item?.materials?.forEach((material: any) => {
                billToTalPrice += material?.totalPrice || 0
              });
              item.billToTalPrice = billToTalPrice || 0
            })
            this.cd.detectChanges()
          }, 0);
          this.cd.detectChanges()
          setTimeout(() => {
            this.isActiveModule = true
            this.cd.detectChanges()
          }, 500);
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
