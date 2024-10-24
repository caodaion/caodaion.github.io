import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpCreatorContentComponent } from './cp-creator-content.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CpCreatorBlockToolbarModule} from "../cp-creator-block-toolbar/cp-creator-block-toolbar.module";


@NgModule({
  declarations: [
    CpCreatorContentComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CpCreatorBlockToolbarModule
  ],
  exports: [
    CpCreatorContentComponent
  ]
})
export class CpCreatorContentModule { }
