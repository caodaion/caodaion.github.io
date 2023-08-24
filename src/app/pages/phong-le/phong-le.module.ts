import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhongLeRoutingModule } from './phong-le-routing.module';
import { PhongLeMainComponent } from './phong-le-main/phong-le-main.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TapSoVanComponent } from './phong-le-main/components/tap-so-van/tap-so-van.component';


@NgModule({
  declarations: [
    PhongLeMainComponent,
    TapSoVanComponent
  ],
  imports: [
    CommonModule,
    PhongLeRoutingModule,
    MatTabsModule
  ]
})
export class PhongLeModule { }
