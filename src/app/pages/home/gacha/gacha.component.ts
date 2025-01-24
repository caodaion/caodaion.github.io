import { Component, OnInit, ViewChild } from '@angular/core';
import { GACHA_DATA } from './gacha.data';
import html2canvas from 'html2canvas-pro';

@Component({
  selector: 'app-gacha',
  templateUrl: './gacha.component.html',
  styleUrls: ['./gacha.component.scss'],
})
export class GachaComponent implements OnInit {
  gachaData: any = GACHA_DATA;
  selectedFrame: any;
  selectedLecture: any;
  isAllowDownload: boolean = false;

  @ViewChild('gachaFrameContainer') gachaFrameContainer: any;
  @ViewChild('gachaFrameWrapper') gachaFrameWrapper: any;
  @ViewChild('lixiBox') lixiBox: any;

  ngOnInit(): void {}

  onRunGacha() {
    this.isAllowDownload = false
    this.lixiBox?.nativeElement?.classList?.add('active')
    const getRandom = (array: any) => {
      return array[Math.floor(Math.random() * array.length)];
    };
    this.selectedFrame = getRandom(this.gachaData?.frames);
    this.selectedFrame.src = this.selectedFrame.src;
    this.selectedLecture = getRandom(this.gachaData?.lectures);        
    setTimeout(() => {
      const wrapperWidth = this.gachaFrameWrapper?.nativeElement.offsetWidth;
      const containerWidth =
        this.gachaFrameContainer?.nativeElement.offsetWidth;
      this.gachaFrameContainer.nativeElement.style.transform = `translate(-50%, -50%) scale(${
        wrapperWidth / containerWidth
      })`;
    }, 0);
    setTimeout(() => {
      this.isAllowDownload = true
    }, 5000);
  }

  downloading: boolean = false;
  saveAsImage(element: any) {
    const wrapperWidth = this.gachaFrameWrapper?.nativeElement.offsetWidth;
    const containerWidth = this.gachaFrameContainer?.nativeElement.offsetWidth;
    this.gachaFrameContainer.nativeElement.style.transform = `translate(-0%, -0%)`;
    const content = document.getElementById(element)?.textContent;
    navigator.clipboard.writeText(content || '');
    setTimeout(() => {
      this.downloading = true;
      const saveItem = document.getElementById(element);
      if (saveItem) {
        html2canvas(saveItem)
          .then((canvas: any) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `caodaion_chuc_mung_nam_moi.png`;
            link.click();
            this.downloading = false;
            this.gachaFrameContainer.nativeElement.style.transform = `translate(-50%, -50%) scale(${
              wrapperWidth / containerWidth
            })`;
          })
          .catch((error: any) => {
            this.downloading = false;
            this.gachaFrameContainer.nativeElement.style.transform = `translate(-50%, -50%) scale(${
              wrapperWidth / containerWidth
            })`;
          });
      }
    }, 0);
  }
}
