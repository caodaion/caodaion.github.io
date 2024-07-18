import { Component, OnInit } from '@angular/core';
import { Bcd100Service } from 'src/app/shared/services/bcd100/bcd100.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  data: any = <any>{}
  bcd100Setting: any = <any>{}

  constructor(private bcd100Service: Bcd100Service) {

  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    if (this.bcd100Service.bcd100Setting?.googleFormsId) {
      this.bcd100Setting = this.bcd100Service.bcd100Setting
    } else {
      this.bcd100Service.fetchBcd100Data().subscribe({
        next: (res: any) => {
          this.bcd100Setting = res.setting;
          this.data = res?.data
          this.data?.forEach((item: any) => {
            if (item?.data) {
              item.data = JSON.parse(item?.data);
            }
          });
          console.log(this.data);          
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          console.info('complete');
        },
      })
    }
  }
}
