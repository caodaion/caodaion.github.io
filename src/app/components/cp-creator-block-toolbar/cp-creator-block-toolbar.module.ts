import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpCreatorBlockToolbarComponent } from './cp-creator-block-toolbar.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import { FormsModule } from '@angular/forms';
import { IconComponent } from "../icon/icon.component";


@NgModule({
  declarations: [
    CpCreatorBlockToolbarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatMenuModule,
    FormsModule,
    IconComponent
],
  exports: [
    CpCreatorBlockToolbarComponent
  ]
})
export class CpCreatorBlockToolbarModule { }
