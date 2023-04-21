import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrRoutingModule } from './qr-routing.module';
import { QrComponent } from './qr.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    QrComponent
  ],
  imports: [
    CommonModule,
    QrRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule
  ]
})
export class QrModule { }
