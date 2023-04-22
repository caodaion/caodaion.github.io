import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QrScannerComponent} from "./qr-scanner.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {QRScannerRoutingModule} from "./qr-scanner-routing.module";
import { CpQrScannerModule } from 'src/app/components/cp-qr-scanner/cp-qr-scanner.module';

@NgModule({
  declarations: [
    QrScannerComponent
  ],
  imports: [
    CommonModule,
    QRScannerRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    CpQrScannerModule
  ]
})
export class QrScannerModule { }
