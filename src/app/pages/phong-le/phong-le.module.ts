import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

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
import { SettingsComponent } from './phong-le-main/components/settings/settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LongSoComponent } from './phong-le-main/components/tap-so-van/long-so/long-so.component';

@NgModule({
  declarations: [
    PhongLeMainComponent,
    TapSoVanComponent,
    SoanSoComponent,
    TuanCuuComponent,
    SettingsComponent,
    LongSoComponent
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
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class PhongLeModule { }
