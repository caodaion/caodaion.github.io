import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    ActionComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatIconModule,
    RouterModule,
    MatGridListModule,
    MatDividerModule
  ],
  exports: [
    ActionComponent
  ]
})
export class ActionModule { }
