import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TacVuService } from 'src/app/shared/services/tac-vu/tac-vu.service';

@Component({
  selector: 'app-nghi-tiet',
  templateUrl: './nghi-tiet.component.html',
  styleUrls: ['./nghi-tiet.component.scss']
})
export class NghiTietComponent implements OnInit {

  nghiTietKey: any;
  nghiTiet: any;

  constructor(
    private route: ActivatedRoute,
    private tacVuService: TacVuService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['nghiTietKey']) {
        this.nghiTietKey = query['nghiTietKey']
        this.getNghiTiet()
      }
    })
  }

  getNghiTiet() {
    this.tacVuService.getNghiTiet(this.nghiTietKey)
      .subscribe((res: any) => {
        if (res.data) {
          this.nghiTiet = res.data
        }
      })
  }

}
