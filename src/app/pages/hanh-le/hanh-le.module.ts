import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HanhLeRoutingModule } from './hanh-le-routing.module';
import { HanhLeComponent } from './hanh-le.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NghiTietComponent } from './nghi-tiet/nghi-tiet.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { HeaderModule } from 'src/app/components/header/header.module';


@NgModule({
  declarations: [
    HanhLeComponent,
    NghiTietComponent
  ],
  imports: [
    CommonModule,
    HanhLeRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    HeaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HanhLeModule { }
