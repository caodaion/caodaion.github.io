import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TuanCuuRoutingModule } from './tuan-cuu-routing.module';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TuanCuuRoutingModule,
    IconComponent
  ]
})
export class TuanCuuModule { }
