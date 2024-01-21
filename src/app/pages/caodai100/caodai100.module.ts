import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Caodai100RoutingModule } from './caodai100-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    Caodai100RoutingModule
  ]
})
export class Caodai100Module { }
