import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpContentCreatorToolbarComponent } from './cp-content-creator-toolbar.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    CpContentCreatorToolbarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatDividerModule
  ],
  exports: [
    CpContentCreatorToolbarComponent
  ],
})
export class CpContentCreatorToolbarModule { }
