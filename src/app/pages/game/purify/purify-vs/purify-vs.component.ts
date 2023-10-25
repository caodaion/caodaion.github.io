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
}
