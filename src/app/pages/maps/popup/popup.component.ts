import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

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
  }
}
