import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expantion-journey',
  templateUrl: './expantion-journey.component.html',
  styleUrls: ['./expantion-journey.component.scss']
})
export class ExpantionJourneyComponent implements OnInit {
  @Input() data: any;
  constructor() {
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
