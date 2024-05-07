import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupComponent } from './popup/popup.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { SearchThanhSoPipe } from './search-thanh-so.pipe';


@NgModule({
  declarations: [
    MapsComponent,
    PopupComponent,
    SearchThanhSoPipe
  ],
  imports: [
    CommonModule,
    MapsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatRippleModule
  ]
})
export class MapsModule { }
