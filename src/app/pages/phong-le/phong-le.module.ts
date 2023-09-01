import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhongLeRoutingModule } from './phong-le-routing.module';
import { PhongLeMainComponent } from './phong-le-main/phong-le-main.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TapSoVanComponent } from './phong-le-main/components/tap-so-van/tap-so-van.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { SoanSoComponent } from './soan-so/soan-so.component';
import { TuanCuuComponent } from './phong-le-main/components/tap-so-van/tuan-cuu/tuan-cuu.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HeaderModule } from "../../components/header/header.module";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CpContentCreatorModule } from 'src/app/components/cp-content-creator/cp-content-creator.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PhongLeMainComponent,
    TapSoVanComponent,
    SoanSoComponent,
    TuanCuuComponent
  ],
  imports: [
    CommonModule,
    PhongLeRoutingModule,
    MatTabsModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule,
    NgxMatTimepickerModule,
    HeaderModule,
    MatProgressBarModule,
    CpContentCreatorModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PhongLeModule { }
