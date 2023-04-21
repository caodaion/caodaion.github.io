import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { FullLayoutComponent } from './full-layout.component';
import { AuthGuard } from "../../shared/guards/auth.guard";
import { ReleasedGuard } from "../../shared/guards/released.guard";


const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      { path: '', redirectTo: 'trang-chu', pathMatch: 'full' },
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('../../modules/main/main.module').then((m) => m.MainModule),
        canActivate: [ReleasedGuard]
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../../modules/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'cai-dat',
        loadChildren: () =>
          import('../../modules/settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'lich',
        loadChildren: () =>
          import('../../modules/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
        canActivate: [ReleasedGuard]
      },
      {
        path: 'tac-vu',
        loadChildren: () =>
          import('../../modules/action/action.module').then(
            (m) => m.ActionModule
          ),
        canActivate: [ReleasedGuard, AuthGuard]
      },
      {
        path: 'qr',
        loadChildren: () =>
          import('../../modules/qr/qr.module').then((m) => m.QrModule),
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullLayoutRoutingModule { }
