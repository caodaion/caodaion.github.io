import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonShareComponent } from './button-share.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    ButtonShareComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    QRCodeModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule
  ],
  exports: [
    ButtonShareComponent
  ]
})
export class ButtonShareModule { }
