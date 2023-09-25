import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PHUONG_TU_TAM_THUA } from 'src/app/shared/constants/master-data/phuong-tu-tam-thua';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {

  updateJourneyDialogRef: any
  selectedIndex: any = 0
  isShowUpdate: boolean = false
  phuongTuTamThuaKeys = <any>[]
  phuongTuTamThua = PHUONG_TU_TAM_THUA

  constructor(
    public matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.phuongTuTamThua = PHUONG_TU_TAM_THUA
  }
}
