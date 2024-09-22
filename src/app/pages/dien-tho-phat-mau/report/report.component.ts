import { Component, Input, OnInit } from '@angular/core';
import { DienThoPhatMauService } from 'src/app/shared/services/dien-tho-phat-mau/dien-tho-phat-mau.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @Input() setting: any;
  @Input() user: any;
  @Input() price: any = <any>[];
  @Input() data: any = <any>[];

  constructor(private dienThoPhatMauService: DienThoPhatMauService) {

  }


  ngOnInit(): void {
    console.log('this.setting', this.setting);
    console.log('this.user', this.user);
    console.log('this.price', this.price);
    console.log('this.data', this.data);

  }

  onExportToExcel(type: any) {
    this.dienThoPhatMauService.exportToExcel(type).subscribe({
      next: (res: any) => {

      },
      error: (error: any) => {

      },
      complete: () => {
        console.info('complete')
      }
    })

  }
}
