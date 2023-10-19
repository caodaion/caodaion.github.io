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
    if (this.gameService.isActivePurifyList && this.purifyList?.length === 0) {
      this.getPurifyList()
      this.cd.detectChanges()
    }
  }

  getPurifyList() {
    this.gameService.getPurifyList()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.purifyList = res.data
          if (!this.contentEditable) {
            this.purifyList = this.purifyList?.filter((item: any) => item.published)
          }
          this.purifyList.forEach((item: any) => {
            item.percent = 50
            if (item.preview) {
              console.log(item.preview.match(/d\/([^\/]+)/));

              item.preview = `https://drive.google.com/uc?export=view&id=${item.preview.match(/d\/([^\/]+)/)[1]}`
            }
          })
          console.log(this.purifyList);

        }
      })
  }
}
