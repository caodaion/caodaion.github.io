import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tap-so-van',
    templateUrl: './tap-so-van.component.html',
    styleUrls: ['./tap-so-van.component.scss'],
    standalone: false
})
export class TapSoVanComponent implements OnInit {

  tuanCuuEvents = <any>[]
  cols: any;
  expanedIndex: any;

  constructor(
  ) {

  }

  ngOnInit(): void {
    this.tuanCuuEvents = JSON.parse(localStorage.getItem('tuanCuu') || '[]')
    const expiriedEvent = this.tuanCuuEvents.filter((item: any) => new Date(item?.event[item?.event?.length - 1].solar) < new Date())
    if (expiriedEvent?.length > 0) {
      expiriedEvent.forEach((item: any) => {
        if (this.tuanCuuEvents?.length == 1) {
          this.tuanCuuEvents = []
        } else {
          let index = this.tuanCuuEvents.indexOf(this.tuanCuuEvents.find((e: any) => e.key == item.key))
          this.tuanCuuEvents.splice(index, 1)
        }
        localStorage.setItem('tuanCuu', JSON.stringify(this.tuanCuuEvents?.map((item: any) => {
          return {
            key: item.key,
            date: item.date,
            details: item.details,
            event: item.event,
          }
        })))
      })
    }
  }
}
