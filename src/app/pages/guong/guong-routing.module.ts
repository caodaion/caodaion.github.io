import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuongComponent } from './guong.component';

const routes: Routes = [
  {
    path: '',
    component: GuongComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuongRoutingModule { }
