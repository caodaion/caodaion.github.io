import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaNhan } from './ca-nhan';
import { Dashboard } from './components/dashboard/dashboard';
import { Settings } from './components/settings/settings';

const routes: Routes = [
  {
    path: '',
    component: CaNhan,
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'thiet-lap',
        component: Settings
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaNhanRoutingModule { }
