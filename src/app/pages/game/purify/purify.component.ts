import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify',
  templateUrl: './purify.component.html',
  styleUrls: ['./purify.component.scss']
})
export class PurifyComponent implements OnInit, AfterViewChecked {

  purifyList = <any>[]
  cols = 6
  constructor(
    private gameService: GameService,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
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
          this.purifyList.forEach((item: any) => {
            item.percent = 50
          })
          console.log(this.purifyList);

        }
      })
  }
}
