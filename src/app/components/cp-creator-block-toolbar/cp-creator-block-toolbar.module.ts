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
    FormsModule
  ],
  exports: [
    CpCreatorBlockToolbarComponent
  ]
})
export class CpCreatorBlockToolbarModule { }
