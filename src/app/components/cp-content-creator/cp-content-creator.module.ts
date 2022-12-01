import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpContentCreatorComponent } from './cp-content-creator.component';
import {CpCreatorBlockModule} from "../cp-creator-block/cp-creator-block.module";
import {CpCreatorContentModule} from "../cp-creator-content/cp-creator-content.module";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {CpContentCreatorToolbarModule} from "../cp-content-creator-toolbar/cp-content-creator-toolbar.module";



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
  ],
  exports: [
    CpContentCreatorComponent
  ]
})
export class CpContentCreatorModule { }
