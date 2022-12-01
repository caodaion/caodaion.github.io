import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from 'src/app/layouts/pagenotfound/pagenotfound.component';
import { ActionComponent } from './action.component';
import {AssessGuard} from "../../shared/guards/assess.guard";
import {VoviGuard} from "../../shared/guards/vovi.guard";

const routes: Routes = [
  {
    path: '',
    component: ActionComponent,
    children: [
      {
        path: 'cau-sieu-vo-vi',
        loadChildren: () =>
          import('../../pages/cau-sieu-vo-vi/cau-sieu-vo-vi.module').then((m) => m.CauSieuVoViModule),
        canActivate: [AssessGuard, VoviGuard]
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionRoutingModule {}
