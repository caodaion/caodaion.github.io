import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  public thanhSo: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
      console.log(this.thanhSo);
      
  }
}
