import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Bcd100Component } from './bcd100.component';

const routes: Routes = [
  {
    path: '',
    component: Bcd100Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Bcd100RoutingModule { }
