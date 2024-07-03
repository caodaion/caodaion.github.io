import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuongRoutingModule } from './guong-routing.module';
import { GuongComponent } from './guong.component';


@NgModule({
  declarations: [
    GuongComponent
  ],
  imports: [
    CommonModule,
    GuongRoutingModule
  ]
})
export class GuongModule { }
