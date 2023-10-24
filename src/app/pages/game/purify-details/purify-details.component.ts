import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify-details',
  templateUrl: './purify-details.component.html',
  styleUrls: ['./purify-details.component.scss']
})
export class PurifyDetailsComponent implements OnInit, AfterViewChecked {

  @ViewChild('videoFrame') videoFrame: any;
  @ViewChild('saveCardDialog') saveCardDialog!: any;

  purify = <any>{}
  purifyKey: any;
  prev: any;
  next: any;
  contentEditable: boolean = false
  currentKid = <any>{};

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.contentEditable = this.authService.contentEditable
    this.route.params.subscribe((params: any) => {
      this.purifyKey = params['key']
      this.getPurifyProfile()
    })
  }

  ngAfterViewChecked(): void {
    if ((this.authService?.currentUser?.role?.includes('kids') && !this.currentKid?.userName) || (this.gameService.isActivePurifyList && this.purifyKey && !this.purify.key)) {
      if (this.gameService.isActiveKidsList) {
        if (this.gameService.isActivePurifyList && this.purifyKey && !this.purify.key) {
          this.getPurifyProfile()
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
          if (this.currentKid?.userName === 'caodaion') {
            this.contentEditable = true
            this.purify.hp += 999999999999
            this.purify.attack += 999999999999
            this.purify.speed += 999999999999
            this.purify.def += 999999999999
            this.purify.percent = 100
          }
          let purifyList = this.gameService?.purifyList
          if (!this.contentEditable) {
            purifyList = purifyList?.filter((item: any) => item.published == true)
          }
          const foundData = purifyList?.find((item: any) => item.key === this.purifyKey)
          if (purifyList?.length > 0) {
            this.prev = purifyList[purifyList.indexOf(foundData) - 1]
            this.next = purifyList[purifyList.indexOf(foundData) + 1]
          }
          if (typeof this.currentKid?.purify === 'string') {
            this.currentKid.purify = JSON.parse(this.currentKid?.purify)
          }
          if (this.currentKid?.purify) {
            const froundPurify = this.currentKid.purify[this.purify?.key]
            if (froundPurify) {
              const rangeCongPhu = parseInt(this.purify?.congPhu?.match(/\{(\d+)\}/)[1]) || 0
              const rangeCongQua = parseInt(this.purify?.congQua?.match(/\{(\d+)\}/)[1]) || 0
              const rangeCongTrinh = parseInt(this.purify?.congTrinh?.match(/\{(\d+)\}/)[1]) || 0
              const collectRange = rangeCongPhu + rangeCongQua + rangeCongTrinh
              const collected = parseFloat(froundPurify?.congPhu) + parseFloat(froundPurify?.congQua) + parseFloat(froundPurify?.congTrinh)
              if (!this.contentEditable) {
                this.purify.percent = ((collected / collectRange) * 100) || 0
              } else {
                this.purify.percent = 100
              }
              if (this.purify.percent >= 100) {
                if (froundPurify?.hp && froundPurify?.attack && froundPurify?.speed && froundPurify?.def) {
                  this.purify.hp += parseFloat(froundPurify?.hp)
                  this.purify.attack += parseFloat(froundPurify?.attack)
                  this.purify.speed += parseFloat(froundPurify?.speed)
                  this.purify.def += parseFloat(froundPurify?.def)
                  this.purify.skill = this.purify?.skill?.filter((item: any) => {
                    return this.purify?.hp >= parseFloat(item?.required?.hp)
                      && this.purify?.attack >= parseFloat(item?.required?.attack)
                      && this.purify?.speed >= parseFloat(item?.required?.speed)
                      && this.purify?.def >= parseFloat(item?.required?.def)
                  })?.sort((a: any, b: any) => { return parseFloat(a?.damage) > parseFloat(b?.damage) || a?.element?.length > b?.element?.length ? 1 : -1 })
                }
              }
            }
          }
        } else {
          this.currentKid.userName = this.authService?.currentUser?.userName
          let purifyList = this.gameService?.purifyList
          if (!this.contentEditable) {
            purifyList = purifyList?.filter((item: any) => item.published == true)
          }
          const foundData = purifyList?.find((item: any) => item.key === this.purifyKey)
          if (purifyList?.length > 0) {
            this.prev = purifyList[purifyList.indexOf(foundData) - 1]
            this.next = purifyList[purifyList.indexOf(foundData) + 1]
          }
        }
      })
  }

  getPurifyProfile() {
    this.gameService.getPurifyByKey(this.purifyKey)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purify = res.data
          if (this.purify.defect) {
            if (typeof this.purify.defect === 'string') {
              this.purify.defect = JSON.parse(this.purify.defect)
            }
          }
          if (this.purify.skill) {
            if (typeof this.purify.skill === 'string') {
              this.purify.skill = JSON.parse(this.purify.skill)
              this.purify.skill = this.purify.skill?.sort((a: any, b: any) => { return parseFloat(a?.damage) > parseFloat(b?.damage) || a?.element?.length > b?.element?.length ? 1 : -1 })
            }
          }
          if (this.purify.preview) {
            if (this.purify.preview.match(/d\/([^\/]+)/)) {
              this.purify.preview = `https://drive.google.com/uc?export=view&id=${this.purify.preview.match(/d\/([^\/]+)/)[1]}`
            }
          }
          if (this.purify.audio) {
            if (this.purify.audio.match(/d\/([^\/]+)/)) {
              this.purify.audio = `https://drive.google.com/uc?export=view&id=${this.purify.audio.match(/d\/([^\/]+)/)[1]}`
            }
          }
          if (this.purify.video) {
            setTimeout(() => {
              if (this.videoFrame) {
                this.videoFrame.nativeElement.innerHTML = `<iframe src="${this.purify.video}" style="width: 100%; height: 100%" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
              }
            }, 0)
          }
          this.purify.percent = 0
          this.integrateKidProfile()
        }
      })
  }

  saveCard() {
    const matDialog = this.matDialog.open(this.saveCardDialog)
  }
}
