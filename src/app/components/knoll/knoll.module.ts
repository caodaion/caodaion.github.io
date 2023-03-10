import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { KnollComponent } from './knoll.component';

@NgModule({
  declarations: [
    KnollComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    KnollComponent
  ]
})
export class KnollModule { }
