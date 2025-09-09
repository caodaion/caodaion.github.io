import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VuonTraiComponent } from './vuon-trai/vuon-trai.component';
import { DetailsComponent } from './dao-lam-con/details/details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'vuon-trai',
        pathMatch: 'full'
      },
      {
        path: 'vuon-trai',
        component: VuonTraiComponent
      },
      {
        path: 'vuon-trai/:key',
        component: DetailsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
