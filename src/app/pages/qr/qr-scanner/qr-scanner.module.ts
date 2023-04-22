import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QrScannerComponent} from "./qr-scanner.component";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {QRScannerRoutingModule} from "./qr-scanner-routing.module";

@NgModule({
  declarations: [
    QrScannerComponent
  ],
  imports: [
    CommonModule,
    QRScannerRoutingModule,
    ZXingScannerModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule
  ]
})
export class QrScannerModule { }
