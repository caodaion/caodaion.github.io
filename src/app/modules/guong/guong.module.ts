import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuongRoutingModule } from './guong-routing.module';
import { GuongComponent } from './guong.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    GuongComponent
  ],
  imports: [
    CommonModule,
    GuongRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule
  ]
})
export class GuongModule { }
