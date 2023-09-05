import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpContentCreatorComponent } from './cp-content-creator.component';
import {CpCreatorBlockModule} from "../cp-creator-block/cp-creator-block.module";
import {CpCreatorContentModule} from "../cp-creator-content/cp-creator-content.module";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {CpContentCreatorToolbarModule} from "../cp-content-creator-toolbar/cp-content-creator-toolbar.module";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    CpContentCreatorComponent
  ],
  imports: [
    CommonModule,
    CpCreatorBlockModule,
    CpCreatorContentModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    CpContentCreatorToolbarModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule
  ],
  exports: [
    CpContentCreatorComponent
  ]
})
export class CpContentCreatorModule { }
