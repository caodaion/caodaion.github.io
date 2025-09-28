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
import { TourMatMenuModule, TourStepTemplateComponent } from "ngx-ui-tour-md-menu";
import { IconComponent } from "src/app/components/icon/icon.component";
import { AppTourMenu } from "src/app/components/app-tour-menu/app-tour-menu";


@NgModule({
  declarations: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    RouterLink,
    CommonModule,
    MatToolbarModule,
    MatTooltipModule,
    CpQrScannerModule,
    MatDialogModule,
    QrScannerModule,
    MatButtonModule,
    TourStepTemplateComponent,
    TourMatMenuModule,
    IconComponent,
    AppTourMenu
],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
