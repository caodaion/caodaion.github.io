import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: false
})
export class DetailsComponent {

  @ViewChild('videoFrame') videoFrame: any;

  contentEditable: boolean = false;
  articleKey: any;
  article = <any>{};
  prev = <any>{}
  next = <any>{}
  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
  }
  ngOnInit(): void {
    this.contentEditable = this.authService.contentEditable
    if (this.authService.currentUser?.userName === 'caodaion') {
      this.contentEditable = true
    }
    this.route.params.subscribe((params: any) => {
      this.articleKey = params['key']
      this.getArticle()
    })
  }

  ngAfterViewChecked(): void {
    if (this.gameService.isActivePurifyList && this.articleKey && !this.article.key) {
      this.getArticle()
      this.cd.detectChanges()
    }
  }

  getArticle() {
    this.gameService.getPurifyByKey(this.articleKey)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.article = res.data
          if (this.article.preview) {
            if (this.article.preview.match(/d\/([^\/]+)/)) {
              this.article.preview = `https://drive.google.com/uc?export=view&id=${this.article.preview.match(/d\/([^\/]+)/)[1]}`
            }
          }
          if (typeof this.article?.images === 'string') {
            this.article.images = JSON.parse(this.article?.images)
          }
          this.article.images = this.article.images?.map((item: any) => {
            const data = <any>{}
            if (item.match(/d\/([^\/]+)/)) {
              data.ready = true
              data.src = `https://drive.google.com/uc?export=view&id=${item.match(/d\/([^\/]+)/)[1]}`
              this.cd.detectChanges()
            }
            return data
          })
          if (this.article.audio) {
            if (this.article.audio.match(/d\/([^\/]+)/)) {
              this.article.audio = `https://drive.google.com/uc?export=view&id=${this.article.audio.match(/d\/([^\/]+)/)[1]}`
            }
          }
          if (this.article.video) {
            setTimeout(() => {
              if (this.videoFrame) {
                this.videoFrame.nativeElement.innerHTML = `<iframe src="${this.article.video}" style="width: 100%; height: 100%" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
              }
            }, 0)
          }
          let quaList = this.gameService?.purifyList
          if (!this.contentEditable) {
            quaList = quaList?.filter((item: any) => item?.published == true)
          }
          const foundData = quaList?.find((item: any) => item.key === this.articleKey)
          if (quaList?.length > 0) {
            this.prev = quaList[quaList.indexOf(foundData) - 1]
            this.next = quaList[quaList.indexOf(foundData) + 1]
          }
        }
      })
  }
}
