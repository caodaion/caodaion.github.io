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
  filteredPurifyList = <any>[]
  kids = <any>[]
  ranking = <any>[]
  cols = 6
  contentEditable: boolean = false
  currentKid = <any>{};
  currentKidUserName: any

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
    this.currentKid = this.authService?.currentUser
    this.currentKidUserName = this.authService?.currentUser?.userName
    if (typeof this.currentKid?.purify === 'string') {
      this.currentKid.purify = JSON.parse(this.currentKid?.purify)
    }
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
    const kids = JSON.parse(JSON.stringify(this.gameService.kidsList))
    if (this.currentKidUserName) {
      this.currentKid = kids?.find((item: any) => item?.userName === this.currentKidUserName)
    }
    if (typeof this.currentKid?.purify === 'string') {
      this.currentKid.purify = JSON.parse(this.currentKid?.purify)
    }
    if (this.currentKid?.userName === 'caodaion') {
      this.contentEditable = true
    }
    this.kids = kids
    if (!this.contentEditable) {
      this.kids = kids?.filter((item: any) => item?.userName !== 'caodaion')
    }
    this.kids?.forEach((item: any) => {
      item.experience = 0
      if (typeof item?.purify === 'string') {
        item.purify = JSON.parse(item?.purify) || <any>{}
      }
      if (item?.purify) {
        if (Object?.keys(item?.purify)?.length > 0) {
          Object?.keys(item?.purify)?.forEach((p: any) => {
            item.experience += parseFloat(item.purify[p]?.congPhu) || 0
            item.experience += parseFloat(item.purify[p]?.congQua) || 0
            item.experience += parseFloat(item.purify[p]?.congTrinh) || 0
            item.experience += parseFloat(item.purify[p]?.hp) || 0
            item.experience += parseFloat(item.purify[p]?.attack) || 0
            item.experience += parseFloat(item.purify[p]?.speed) || 0
            item.experience += parseFloat(item.purify[p]?.def) || 0
          })
          item.experience += ((parseFloat(item.wins) || 0) * 2)
          item.experience += parseFloat(item.losses) || 0
          item.experience += parseFloat(item.point) || 0
        }
      }
    })
    this.kids = this.kids?.sort((a: any, b: any) => a?.experience < b?.experience ? 1 : -1)
    if (typeof this.currentKid?.purify === 'string') {
      this.currentKid.purify = JSON.parse(this.currentKid?.purify)
    }
    if (!this.contentEditable) {
      this.purifyList = this.purifyList?.filter((item: any) => item.published == true)
    }
    this.filteredPurifyList = <any>[]
    if (this.currentKid?.purify) {
      this.filteredPurifyList = JSON.parse(JSON.stringify(this.purifyList))
      this.filteredPurifyList?.forEach((item: any) => {
        const froundPurify = this.currentKid?.purify[item?.key]
        if (froundPurify) {
          const rangeCongPhu = parseInt(item?.congPhu?.match(/\{(\d+)\}/)[1]) || 0
          const rangeCongQua = parseInt(item?.congQua?.match(/\{(\d+)\}/)[1]) || 0
          const rangeCongTrinh = parseInt(item?.congTrinh?.match(/\{(\d+)\}/)[1]) || 0
          const collectRange = rangeCongPhu + rangeCongQua + rangeCongTrinh
          const collected = parseFloat(froundPurify?.congPhu) + parseFloat(froundPurify?.congQua) + parseFloat(froundPurify?.congTrinh)
          item.percent = ((collected / collectRange) * 100) || 0
          if (item.percent >= 100) {
            if (froundPurify?.hp && froundPurify?.attack && froundPurify?.speed && froundPurify?.def) {
              item.hp += parseFloat(froundPurify?.hp)
              item.attack += parseFloat(froundPurify?.attack)
              item.speed += parseFloat(froundPurify?.speed)
              item.def += parseFloat(froundPurify?.def)
            }
          }
        }
      })
    } else {
      this.filteredPurifyList = JSON.parse(JSON.stringify(this.purifyList))
      if (this.currentKid?.userName === 'caodaion') {
        this.filteredPurifyList?.forEach((item: any) => {
          item.percent = 100
        })
      }
    }
    this.ranking = this.kids?.filter((item: any) => !item.key?.includes('test'))
  }

  getPurifyList() {
    this.gameService.getPurifyList()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purifyList = JSON.parse(JSON.stringify(res.data))
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

  getElementValue(name: any) {
    return this.gameService.element[name]?.name || '??'
  }
}
