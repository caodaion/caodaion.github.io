import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnglishRoutingModule } from './english-routing.module';
import { EnglishComponent } from './english.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from "../../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    EnglishComponent,
  ],
  imports: [
    CommonModule,
    EnglishRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    SharedModule,
    MatDialogModule,
    MatDividerModule
]
})
export class EnglishModule { }
