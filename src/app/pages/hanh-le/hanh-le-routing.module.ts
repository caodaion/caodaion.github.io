import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanhLeComponent } from './hanh-le.component';
import { NghiTietComponent } from './nghi-tiet/nghi-tiet.component';

const routes: Routes = [
  {
    path: '',
    component: HanhLeComponent
  },
  {
    path: ':nghiTietKey',
    component: NghiTietComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HanhLeRoutingModule { }
