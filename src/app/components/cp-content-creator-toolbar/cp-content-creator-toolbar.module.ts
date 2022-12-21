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
    MatDialogModule
  ],
  exports: [
    CpContentCreatorToolbarComponent
  ],
})
export class CpContentCreatorToolbarModule { }
