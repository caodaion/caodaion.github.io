import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { KnollComponent } from './knoll.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { ButtonShareModule } from '../button-share/button-share.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from "../icon/icon.component";

@NgModule({
  declarations: [
    KnollComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule,
    ButtonShareModule,
    MatTooltipModule,
    IconComponent
],
  exports: [
    KnollComponent
  ]
})
export class KnollModule { }
