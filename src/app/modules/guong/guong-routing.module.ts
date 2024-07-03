import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from 'src/app/layouts/pagenotfound/pagenotfound.component';
import { GuongComponent } from './guong.component';

const routes: Routes = [
  {
    path: '',
    component: GuongComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/guong/guong.module').then((m) => m.GuongModule),
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuongRoutingModule { }
