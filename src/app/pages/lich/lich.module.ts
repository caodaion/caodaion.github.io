import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LichRoutingModule } from './lich-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LichRoutingModule,
    MatSidenavModule
  ]
})
export class LichModule { }