import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-purify-details',
  templateUrl: './purify-details.component.html',
  styleUrls: ['./purify-details.component.scss']
})
export class PurifyDetailsComponent implements OnInit, AfterViewChecked {

  purify = <any>{}
  purifyKey: any;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute
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
          // this.purify.percent = 50
        }
      })
  }
}
