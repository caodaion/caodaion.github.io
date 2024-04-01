import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TimeComponent } from './time/time.component';
import { MatButtonModule } from '@angular/material/button';
import { LoiKhuyenCanYeuComponent } from './loi-khuyen-can-yeu/loi-khuyen-can-yeu.component';
import { ActionModule } from './action/action.module';
import { WelcomeModule } from './welcome/welcome.module';
import { BaiThuongYeuModule } from './bai-thuong-yeu/bai-thuong-yeu.module';

@NgModule({
  declarations: [
    HomeComponent,
    TimeComponent,
    LoiKhuyenCanYeuComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ActionModule,
    WelcomeModule,
    BaiThuongYeuModule
  ]
})
export class HomeModule { }
