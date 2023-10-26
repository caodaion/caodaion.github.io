import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purify-vs',
  templateUrl: './purify-vs.component.html',
  styleUrls: ['./purify-vs.component.scss']
})
export class PurifyVsComponent implements OnInit {
  challengerLeft = <any>{}
  challengerRight = <any>{}
  fighting: boolean = false
  loading: boolean = false
  turn: any;
  turnAnimation: any;

  ngOnInit(): void {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  disabledFight() {
    return !(this.challengerLeft?.fightingPurify?.length > 0 && this.challengerRight?.fightingPurify?.length > 0)
  }

  toggleFighting() {
    this.fighting = !this.fighting
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  randomFirstTurn() {
    this.turn = Math.random() >= 0.5 ? 'left' : 'right'
    this.switchTurn()
  }

  switchTurn() {
    this.turnAnimation = {
      to: this.turn,
      turn: this.turn === 'left' ? this.challengerLeft : this.challengerRight,
    }
    setTimeout(() => {
      this.turnAnimation = null
      console.log(this.turn);

    }, 1000);
  }
}
