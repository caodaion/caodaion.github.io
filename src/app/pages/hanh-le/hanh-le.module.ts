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
import { SwiperDirective } from './directive/swiperDirective';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    HanhLeComponent,
    NghiTietComponent,
    SwiperDirective
  ],
  imports: [
    CommonModule,
    HanhLeRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    HeaderModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HanhLeModule { }
