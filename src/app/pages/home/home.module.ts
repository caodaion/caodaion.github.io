import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeRoutingModule } from './home-routing.module';
import { ActionComponent } from './action/action.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BaiThuongYeuComponent } from './bai-thuong-yeu/bai-thuong-yeu.component';

@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent,
    ActionComponent,
    BaiThuongYeuComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class HomeModule { }
