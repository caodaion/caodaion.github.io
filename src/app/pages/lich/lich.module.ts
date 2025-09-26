import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LichRoutingModule } from './lich-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { IconComponent } from 'src/app/components/icon/icon.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LichRoutingModule,
    MatSidenavModule,
    IconComponent
  ]
})
export class LichModule { }