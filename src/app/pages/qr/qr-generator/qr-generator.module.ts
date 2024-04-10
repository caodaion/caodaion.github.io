import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QrGeneratorComponent} from "./qr-generator.component";
import {QRCodeModule} from "angularx-qrcode";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {QRGeneratorRoutingModule} from "./qr-generator-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [
    QrGeneratorComponent
  ],
  imports: [
    CommonModule,
    QRGeneratorRoutingModule,
    QRCodeModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class QrGeneratorModule { }
