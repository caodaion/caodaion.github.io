import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-dao-lam-con',
  templateUrl: './dao-lam-con.component.html',
  styleUrls: ['./dao-lam-con.component.scss']
})
export class DaoLamConComponent implements AfterViewChecked, OnInit {

  contentEditable: boolean = false
  quaList = <any>[]
  cols: number = 2;

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
        this.cols = 5
      }
    });
    this.contentEditable = this.authService.contentEditable
  }
  ngAfterViewChecked(): void {
    if (this.gameService.isActiveKidsList) {
      if (this.gameService.isActivePurifyList && this.quaList?.length === 0) {
        this.getQuaList()
        this.cd.detectChanges()
      }
    }
  }

  getQuaList() {
    this.gameService.getPurifyList()
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.quaList = JSON.parse(JSON.stringify(res.data))
          this.quaList.forEach((item: any) => {
            if (item.preview) {
              if (item.preview.match(/d\/([^\/]+)/)) {
                item.preview = `https://drive.google.com/uc?export=view&id=${item.preview.match(/d\/([^\/]+)/)[1]}`
              }
            }
          })
          if (!this.contentEditable) {
            this.quaList = this.quaList?.filter((item: any) => item?.published == true)
          }
        }
      })
  }
}
