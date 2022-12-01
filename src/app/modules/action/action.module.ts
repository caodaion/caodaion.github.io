import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActionRoutingModule } from './action-routing.module';
import {AssessGuard} from "../../shared/guards/assess.guard";
import {VoviGuard} from "../../shared/guards/vovi.guard";



@NgModule({
  declarations: [
    ActionComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    ActionRoutingModule
  ],
  providers: [
    AssessGuard,
    VoviGuard
  ]
})
export class ActionModule { }
