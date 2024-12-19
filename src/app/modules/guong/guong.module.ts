import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuongRoutingModule } from './guong-routing.module';
import { GuongComponent } from './guong.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GuongFormComponent } from './guong-form/guong-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from "../../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    GuongComponent,
    GuongFormComponent
  ],
  imports: [
    CommonModule,
    GuongRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    SharedModule,
    MatDialogModule,
    MatSelectModule
]
})
export class GuongModule { }
