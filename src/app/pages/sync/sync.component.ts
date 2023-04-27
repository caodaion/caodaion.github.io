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
  displayedColumns = ['timestamp', 'type', 'location', 'rating', 'device', 'comment']
  confirmSyncJourneyDialogRef: any;
  @ViewChild('confirmSyncJourneyDialog') confirmSyncJourneyDialog!: any;
  isSyncSavedLoccaly: any;
  checkInTypes = CHECKINTYPES
  checkInEvents = CHECKINEVENT

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



  mergeLocalstorageVariable() {
    const mergeLocation = () => {
      let localstorageLocation = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.location
      if (localstorageLocation && localstorageLocation?.length > 0) {
        this.checkInTypes = this.checkInTypes.concat(localstorageLocation.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    const mergeType = () => {
      let localstorageType = JSON.parse(localStorage.getItem('addedVariable') || 'null')?.type
      if (localstorageType && localstorageType?.length > 0) {
        this.checkInEvents = this.checkInEvents.concat(localstorageType.map((item: any) => {
          return {
            key: item,
            label: item,
            disabled: false,
          }
        }))
      }
    }
    mergeLocation()
    mergeType()
  }

  ngOnInit(): void {
    this.mergeLocalstorageVariable()
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
      const localStorageJourneyData = JSON.stringify(JSON.parse(localStorage.getItem('journey') || '[]').sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1))
      if (typeof this.syncData.data !== 'string') {
        this.syncData.data = JSON.stringify(this.syncData.data?.sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1))
      }
      if (JSON.stringify(JSON.parse(this.syncData.data)?.sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1)) == JSON.stringify(JSON.parse(localStorageJourneyData || '')?.sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1))) {
        this.syncData.data = JSON.parse(this.syncData.data).sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1)
        this.isSyncSavedLoccaly = true
      } else {
        if (typeof this.syncData.data == 'string') {
          this.syncData.data = JSON.parse(this.syncData.data).sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1)
        } else {
          this.syncData.data = this.syncData.data.sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : 1)
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
    let storedData = ''
    if (typeof this.syncData.data !== 'string') {
      storedData = JSON.stringify(this.syncData.data)
    } else {
      storedData = this.syncData.data
    }
    const mergeNewVariable = () => {
      console.log(this.checkInTypes);
      let localStorageVariable = JSON.parse(localStorage.getItem('addedVariable') || 'null')
      const syncLocation = this.syncData.data?.filter((item: any) => !this.checkInTypes?.every((cit: any) => cit?.key?.includes(item?.location)))
      const syncType = this.syncData.data?.filter((item: any) => !this.checkInEvents?.every((cie: any) => cie?.key?.includes(item?.type)))
      if (!localStorageVariable) {
        localStorageVariable = {
          location: [],
          type: []
        }
      }
      if (syncLocation?.length > 0) {
        if (!localStorageVariable?.location) {
          localStorageVariable.location = []
        }
        localStorageVariable.location = [...new Set(localStorageVariable.location
          .concat(syncLocation?.filter((item: any) => !!item?.location && this.checkInTypes?.every((ci: any) => !ci.key?.includes(item?.location)))?.map((item: any) => item?.location)))]
      }
      if (syncType?.length > 0) {
        if (!localStorageVariable?.type) {
          localStorageVariable.type = []
        }
        localStorageVariable.type = [...new Set(localStorageVariable.type
          .concat(syncType?.filter((item: any) => !!item?.type && this.checkInEvents?.every((ci: any) => !ci.key?.includes(item?.type)))?.map((item: any) => item?.type)))]
      }
      localStorage.setItem('addedVariable', JSON.stringify(localStorageVariable))
    }
    mergeNewVariable()
    localStorage.setItem('journey', storedData)
    setTimeout(() => {
      this.onGetSyncData()
    }, 0)
  }

  onGoToGenerate() {
    this.router.navigate(['/qr/tao-ma'], {
      state: {
        selectedIndex: 2
      }
    })
  }
}
