import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify',
  templateUrl: './purify.component.html',
  styleUrls: ['./purify.component.scss']
})
export class PurifyComponent implements OnInit, AfterViewChecked {

  purifyList = <any>[]
  cols = 6
  contentEditable: boolean = false
  currentKid = <any>{};

  constructor(
    private gameService: GameService,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {


  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 2
        } else {
          this.cols = 6
        }
      });
    this.contentEditable = this.authService.contentEditable
  }

  ngAfterViewChecked(): void {
    if ((this.authService?.currentUser?.role?.includes('kids') && !this.currentKid?.userName) || (this.gameService.isActivePurifyList && this.purifyList?.length === 0)) {
      if (this.gameService.isActiveKidsList) {
        if (this.gameService.isActivePurifyList && this.purifyList?.length === 0) {
          this.getPurifyList()
          this.cd.detectChanges()
        }
      }
    }
  }

  integrateKidProfile() {
    this.gameService.getKidByUserName(this.authService?.currentUser?.userName)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.currentKid = res.data
          if (typeof this.currentKid?.purify === 'string') {
            this.currentKid.purify = JSON.parse(this.currentKid?.purify)
          }
          if (this.currentKid?.purify) {
            this.purifyList?.forEach((item: any) => {
              const froundPurify = this.currentKid?.purify[item?.key]
              if (froundPurify) {
                const rangeCongPhu = parseInt(item?.congPhu?.match(/\{(\d+)\}/)[1]) || 0
                const rangeCongQua = parseInt(item?.congQua?.match(/\{(\d+)\}/)[1]) || 0
                const rangeCongTrinh = parseInt(item?.congTrinh?.match(/\{(\d+)\}/)[1]) || 0
                const collectRange = rangeCongPhu + rangeCongQua + rangeCongTrinh
                const collected = parseFloat(froundPurify?.congPhu) + parseFloat(froundPurify?.congQua) + parseFloat(froundPurify?.congTrinh)
                if (!this.contentEditable) {
                  item.percent = ((collected / collectRange) * 100) || 0
                } else {
                  item.percent = 100
                }
              }
            })
          }
        } else {
          this.currentKid.userName = this.authService?.currentUser?.userName
        }
      })
  }

  getPurifyList() {
    this.gameService.getPurifyList()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purifyList = res.data
          if (!this.contentEditable) {
            this.purifyList = this.purifyList?.filter((item: any) => item.published == true)
          }
          this.purifyList.forEach((item: any) => {
            item.percent = 0
            if (item.preview) {
              if (item.preview.match(/d\/([^\/]+)/)) {
                item.preview = `https://drive.google.com/uc?export=view&id=${item.preview.match(/d\/([^\/]+)/)[1]}`
              }
            }
          })
          this.integrateKidProfile()
        }
      })
  }
}
