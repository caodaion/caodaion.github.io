import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from '../../layouts/pagenotfound/pagenotfound.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'thong-bao',
        loadChildren: () => import('../../pages/notifications/notifications.module').then((m) => m.NotificationsModule),
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
