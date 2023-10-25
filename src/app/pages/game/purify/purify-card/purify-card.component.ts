import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify-card',
  templateUrl: './purify-card.component.html',
  styleUrls: ['./purify-card.component.scss']
})
export class PurifyCardComponent implements AfterViewChecked {
  @Input() purify: any;
  @Input() saveCard: boolean = false;

  @ViewChild('purifyCardWrapper') purifyCardWrapper: any;
  @ViewChild('purifyCard') purifyCard: any;

  @Output() attack = new EventEmitter();

  updatedStyle = <any>{}
  qrData: any;

  constructor(
    private cd: ChangeDetectorRef,
    private commonService: CommonService,
    private captureService: NgxCaptureService,
    private gameService: GameService
  ) {

  }
  ngAfterViewChecked(): void {
    this.getStyleForWrapper()
    if (this.purify?.preview) {
      if (this.purify?.preview.match(/d\/([^\/]+)/)) {
        this.purify.preview = `https://drive.google.com/uc?export=view&id=${this.purify.preview.match(/d\/([^\/]+)/)[1]}`
      }
    }
    this.cd.detectChanges()
  }
  getStyleForWrapper(): any {
    this.qrData = location.href
    let value = this.purifyCard?.nativeElement?.offsetWidth / this.purifyCardWrapper?.nativeElement?.offsetWidth
    if (this.purifyCard?.nativeElement?.offsetWidth > this.purifyCardWrapper?.nativeElement?.offsetWidth) {
      value = this.purifyCardWrapper?.nativeElement?.offsetWidth / this.purifyCard?.nativeElement?.offsetWidth
    }
    this.updatedStyle = {
      card: `transform: scale(${((value) * 100) / 100})`,
      wrapper: `height: ${this.purifyCard?.nativeElement?.offsetHeight * (((value) * 100) / 100)}px`,
      qrCode: this.purifyCard?.nativeElement?.offsetHeight * (((value) * 100) / 100),
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

  getElementValue(name: any) {
    return this.gameService.element[name]?.name || '??'
  }

  onAttack(skill: any) {
    this.attack.emit(skill)
  }
}
