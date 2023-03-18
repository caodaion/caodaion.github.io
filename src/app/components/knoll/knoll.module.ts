import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { KnollComponent } from './knoll.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    KnollComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule
  ],
  exports: [
    KnollComponent
  ]
})
export class KnollModule { }
