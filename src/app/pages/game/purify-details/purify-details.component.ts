import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify-details',
  templateUrl: './purify-details.component.html',
  styleUrls: ['./purify-details.component.scss']
})
export class PurifyDetailsComponent implements OnInit, AfterViewChecked {

  @ViewChild('purifyCardWrapper') purifyCardWrapper: any;
  @ViewChild('purifyCard') purifyCard: any;
  @ViewChild('videoFrame') videoFrame: any;

  purify = <any>{}
  updatedStyle = <any>{}
  purifyKey: any;
  prev: any;
  next: any;
  contentEditable: boolean = false
  currentKid = <any>{};

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private captureService: NgxCaptureService,
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
    this.getStyleForWrapper()
    this.cd.detectChanges()
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
            const froundPurify = this.currentKid.purify[this.purify?.key]
            if (froundPurify) {
              const collectRange = this.purify?.congPhu + this.purify?.congQua + this.purify?.congTrinh
              const collected = parseFloat(froundPurify?.congPhu) + parseFloat(froundPurify?.congQua) + parseFloat(froundPurify?.congTrinh)
              this.purify.percent = ((collected / collectRange) * 100) || 0
            }
          }
        } else {
          this.currentKid.userName = this.authService?.currentUser?.userName
        }
      })
  }

  getPurifyProfile() {
    this.gameService.getPurifyByKey(this.purifyKey)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purify = res.data
          let purifyList = this.gameService?.purifyList
          if (!this.contentEditable) {
            purifyList = purifyList?.filter((item: any) => item.published == 'TRUE')
          }
          const foundData = purifyList?.find((item: any) => item.key === this.purifyKey)
          if (purifyList?.length > 0) {
            this.prev = purifyList[purifyList.indexOf(foundData) - 1]
            this.next = purifyList[purifyList.indexOf(foundData) + 1]
          }
          if (this.purify.defect) {
            if (typeof this.purify.defect === 'string') {
              this.purify.defect = JSON.parse(this.purify.defect)
            }
          }
          if (this.purify.skill) {
            if (typeof this.purify.skill === 'string') {
              this.purify.skill = JSON.parse(this.purify.skill)
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

  getStyleForWrapper(): any {
    let value = this.purifyCard?.nativeElement?.offsetWidth / this.purifyCardWrapper?.nativeElement?.offsetWidth
    if (this.purifyCard?.nativeElement?.offsetWidth > this.purifyCardWrapper?.nativeElement?.offsetWidth) {
      value = this.purifyCardWrapper?.nativeElement?.offsetWidth / this.purifyCard?.nativeElement?.offsetWidth
    }
    this.updatedStyle = {
      card: `transform: scale(${((value) * 100) / 100})`,
      wrapper: `height: ${this.purifyCard?.nativeElement?.offsetHeight * (((value) * 100) / 100)}px`
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  downloading: boolean = false
  saveAsImage(element: any) {
    setTimeout(() => {
      this.downloading = true
      const saveItem = this.purifyCard?.nativeElement
      this.captureService
        //@ts-ignore
        .getImage(saveItem, true)
        .pipe(
          tap((img) => {
            // converts base 64 encoded image to blobData
            let blobData = this.convertBase64ToBlob(img)
            // saves as image
            const blob = new Blob([blobData], { type: "image/png" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            // name of the file
            link.download = this.commonService.generatedSlug(`${this.purify.key}. ${this.purify.name}`)
            link.click()
            this.downloading = false
          })
        )
        .subscribe();
    }, 0)
  }
}
