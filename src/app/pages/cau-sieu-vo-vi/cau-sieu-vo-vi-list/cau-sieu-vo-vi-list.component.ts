import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DocumentModel } from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';
import { CauSieuVoViService } from 'src/app/shared/services/cau-sieu-vo-vi/cau-sieu-vo-vi.service';

@Component({
  selector: 'app-cau-sieu-vo-vi-list',
  templateUrl: './cau-sieu-vo-vi-list.component.html',
  styleUrls: ['./cau-sieu-vo-vi-list.component.scss'],
})
export class CauSieuVoViListComponent implements OnInit {
  cauSieuVoViList: DocumentModel[] = [];
  cols = 1;
  isLoading: boolean = false;
  constructor(
    private cauSieuVoViService: CauSieuVoViService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser?.role?.includes('administrator')) {
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
          if (state.matches) {
            this.cols = 1;
          } else {
            this.cols = 4;
          }
        });
      this.getCauSieuVoViList();
    } else {
      this.router.navigate(['/tac-vu']);
    }
  }

  getCauSieuVoViList() {
    this.isLoading = true;
    this.cauSieuVoViService.getCauSieuVoViList().subscribe(
      (res: any) => {
        console.log(res);

        if (!!res?.data) {
          this.cauSieuVoViList = res?.data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getCardDetails(item: any) {
    const informationGroup = item?.formGroup?.find(
      (item: any) => item.key === 'thong-tin-chung'
    )?.control;
    const nam = informationGroup?.find(
      (item: any) => item.key === 'nam-am-lich'
    )?.value;
    const thang = informationGroup?.find(
      (item: any) => item.key === 'thang-am-lich'
    )?.value;
    const ngay = informationGroup?.find(
      (item: any) => item.key === 'ngay-am-lich'
    )?.value;
    const countGroup = item?.formGroup?.find(
      (item: any) => item.key === 'thong-tin-cau-sieu'
    )?.control;
    const count = countGroup?.find((item: any) => item.key === 'linh-hon')
      ?.value?.length;
    return {
      title: `Cầu siêu vào ngày ${ngay} tháng ${thang} năm ${nam}`,
      count: count,
    };
  }
}
