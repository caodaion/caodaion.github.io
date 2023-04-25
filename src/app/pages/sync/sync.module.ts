import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncRoutingModule } from './sync-routing.module';
import { SyncComponent } from './sync.component';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SyncComponent
  ],
  imports: [
    CommonModule,
    SyncRoutingModule,
    MatTableModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class SyncModule { }
