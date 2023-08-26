import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhongLeMainComponent } from './phong-le-main/phong-le-main.component';
import { SoanSoComponent } from './soan-so/soan-so.component';

const routes: Routes = [
  {
    path: '',
    component: PhongLeMainComponent
  },
  {
    path: 'soan-so/:token',
    component: SoanSoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhongLeRoutingModule { }
