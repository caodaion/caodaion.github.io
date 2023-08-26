import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tap-so-van',
  templateUrl: './tap-so-van.component.html',
  styleUrls: ['./tap-so-van.component.scss']
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
  }
}
