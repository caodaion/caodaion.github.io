import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing-module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { CpQrScannerModule } from "src/app/components/cp-qr-scanner/cp-qr-scanner.module";
import { MatDialogModule } from "@angular/material/dialog";
import { QrScannerModule } from "src/app/components/qr-scanner/qr-scanner.module";
import { MatButtonModule } from '@angular/material/button';
import { TourMatMenuModule } from "ngx-ui-tour-md-menu";


@NgModule({
  declarations: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    RouterLink, CommonModule, MatToolbarModule, MatTooltipModule,
    CpQrScannerModule,
    MatDialogModule,
    QrScannerModule,
    MatButtonModule,
    TourMatMenuModule
],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
