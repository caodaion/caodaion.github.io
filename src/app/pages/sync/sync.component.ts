import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CHECKINTYPES, CHECKINEVENT } from 'src/app/shared/constants/master-data/check-in.constant';
import { TIME_TYPE } from 'src/app/shared/constants/master-data/time-type.constant';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  syncData: any;
  ratingPieChartLabels = ["Hoàn toàn không", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng", "Chưa đánh giá"];
  public isShowPhoneLayout: boolean = true
  displayedColumns = ['timestamp', 'type', 'location', 'rating', 'comment']
  confirmSyncJourneyDialogRef: any;
  @ViewChild('confirmSyncJourneyDialog') confirmSyncJourneyDialog!: any;
  isSyncSavedLoccaly: any;

  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isShowPhoneLayout = true;
        } else {
          this.isShowPhoneLayout = false;
        }
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      if (query['token']) {
        this.syncData = this.jwtHelper.decodeToken(query['token']);
        this.onGetSyncData()
      }
    })
  }

  onGetSyncData() {
    console.log(this.syncData);
    if (this.syncData.type == 'journey') {
      const localStorageJourneyData = localStorage.getItem('journey')
      if (typeof this.syncData.data !== 'string') {
        this.syncData.data = JSON.stringify(this.syncData.data)
      }
      if (this.syncData.data == localStorageJourneyData) {
        this.syncData.data = JSON.parse(this.syncData.data)
        this.isSyncSavedLoccaly = true
      } else {
        if (typeof this.syncData.data == 'string') {
          this.syncData.data = JSON.parse(this.syncData.data)
        } else {
          this.syncData.data = this.syncData.data
        }
      }
    }
  }

  getRowData(item: any, object: any) {
    if (object == 'location') {
      return CHECKINTYPES.find((cit: any) => cit.key == item.location)?.label || 'Chưa xác định'
    }
    if (object == 'type') {
      if (item?.tuThoiType) {
        return `Cúng Thời ${TIME_TYPE.data.find((tt: any) => tt.key == item.tuThoiType)?.name.split('|')[0]}`
      }
      return CHECKINEVENT.find((cie: any) => cie.key == item.type)?.label || 'Chưa xác định'
    }
    return ''
  }

  onSyncJourneyData() {
    const localStorageJourneyData = JSON.parse(localStorage.getItem('journey') || '[]')
    if (localStorageJourneyData?.length == 0) {
      this.storeJourney()
    } else {
      this.confirmSyncJourneyDialogRef = this.matDialog.open(this.confirmSyncJourneyDialog)
    }
  }

  storeJourney() {
    if (typeof this.syncData.data !== 'string') {
      this.syncData.data = JSON.stringify(this.syncData.data)
    }
    localStorage.setItem('journey', JSON.stringify(this.syncData.data))
    setTimeout(() => {
      this.onGetSyncData()
    }, 0)
  }

  onGoToGenerate() {
    this.router.navigate(['/qr/tao-ma'], {
      queryParams: {
        selectedIndex: 2
      }
    })
  }
}
