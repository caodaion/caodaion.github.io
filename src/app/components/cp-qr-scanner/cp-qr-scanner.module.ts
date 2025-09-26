import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpQrScannerComponent } from './cp-qr-scanner.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from "../icon/icon.component";



@NgModule({
  declarations: [
    CpQrScannerComponent
  ],
  imports: [
    CommonModule,
    NgxScannerQrcodeModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    IconComponent
],
  exports: [
    CpQrScannerComponent
  ]
})
export class CpQrScannerModule { }
