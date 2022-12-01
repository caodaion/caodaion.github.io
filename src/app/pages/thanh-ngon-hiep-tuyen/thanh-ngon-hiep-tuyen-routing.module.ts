import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TnhtTableContentComponent} from "./tnht-table-content/tnht-table-content.component";
import {TnhtContentComponent} from "./tnht-content/tnht-content.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component:  TnhtTableContentComponent},
      { path: ':key', component:  TnhtContentComponent},
      { path: ':key/:level', component:  TnhtContentComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThanhNgonHiepTuyenRoutingModule {}
