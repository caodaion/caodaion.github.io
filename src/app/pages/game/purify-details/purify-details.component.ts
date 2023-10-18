import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
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

  purify = <any>{}
  purifyKey: any;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private captureService: NgxCaptureService
  ) {

  }
  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.purifyKey = params['key']
    })
  }

  ngAfterViewChecked(): void {
    if (this.gameService.isActivePurifyList && this.purifyKey && !this.purify.key) {
      this.getPurifyProfile()
    }
  }

  getPurifyProfile() {
    this.gameService.getPurifyByKey(this.purifyKey)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purify = res.data
          this.purify.percent = 100
          this.purify.counter = JSON.parse(this.purify.counter)
          console.log(this.purify);
        }
      })
  }

  getStyleForWrapper() {
    return `transform: scale(${1 - (100 / (this.purifyCard?.nativeElement?.offsetWidth - this.purifyCardWrapper?.nativeElement?.offsetWidth))}) translateX(-${(100 * (100 / (this.purifyCard?.nativeElement?.offsetWidth - this.purifyCardWrapper?.nativeElement?.offsetWidth))) / 2}%)`
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
