import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpCreatorBlockComponent } from './cp-creator-block.component';
import {CpCreatorContentModule} from "../cp-creator-content/cp-creator-content.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CpCreatorBlockToolbarModule} from "../cp-creator-block-toolbar/cp-creator-block-toolbar.module";



@NgModule({
  declarations: [
    CpCreatorBlockComponent
  ],
    imports: [
        CommonModule,
        CpCreatorContentModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        CpCreatorBlockToolbarModule
    ],
  exports: [
    CpCreatorBlockComponent
  ]
})
export class CpCreatorBlockModule { }
