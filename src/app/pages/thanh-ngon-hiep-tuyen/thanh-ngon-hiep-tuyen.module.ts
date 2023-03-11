import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThanhNgonHiepTuyenRoutingModule} from "./thanh-ngon-hiep-tuyen-routing.module";
import {TnhtTableContentComponent} from './tnht-table-content/tnht-table-content.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {TnhtContentComponent} from './tnht-content/tnht-content.component';
import {CpContentCreatorModule} from "../../components/cp-content-creator/cp-content-creator.module";
import {CpCreatorContentModule} from "../../components/cp-creator-content/cp-creator-content.module";
import {HeaderModule} from "../../components/header/header.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {BottomNavigatorModule} from "../../components/bottom-navigator/bottom-navigator.module";


@NgModule({
  declarations: [
    TnhtTableContentComponent,
    TnhtContentComponent
  ],
  imports: [
    CommonModule,
    ThanhNgonHiepTuyenRoutingModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    CpContentCreatorModule,
    CpCreatorContentModule,
    HeaderModule,
    MatProgressBarModule,
    BottomNavigatorModule
  ]
})
export class ThanhNgonHiepTuyenModule {
}
