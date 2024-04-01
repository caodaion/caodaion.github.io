import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaiThuongYeuComponent } from './bai-thuong-yeu.component';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [BaiThuongYeuComponent],
  imports: [
    CommonModule,
    MatDividerModule
  ],
  exports: [
    BaiThuongYeuComponent
  ]
})
export class BaiThuongYeuModule { }
