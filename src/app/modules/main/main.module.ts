import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MainRoutingModule
  ]
})
export class MainModule { }
