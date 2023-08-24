import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhongLeMainComponent } from './phong-le-main/phong-le-main.component';

const routes: Routes = [
  {
    path: '',
    component: PhongLeMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhongLeRoutingModule { }
