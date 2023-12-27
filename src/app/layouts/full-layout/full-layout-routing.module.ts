import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {PagenotfoundComponent} from '../pagenotfound/pagenotfound.component';
import {FullLayoutComponent} from './full-layout.component';
import {ReleasedGuard} from "../../shared/guards/released.guard";


const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        matcher: (url) => {
          if (url?.length === 1 && url[0].path.match(/^@[\w]+$/gm)) {
            return {
              consumed: url,
              posParams: {
                username: new UrlSegment(url[0].path.slice(1), {})
              }
            };
          }
          return null
        },
        loadChildren: () =>
          import('../../modules/profile/profile.module').then((m) => m.ProfileModule),
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
        canActivate: [ReleasedGuard]
      },
      {
        path: 'kids',
        loadChildren: () =>
          import('../../modules/game/game.module').then(
            (m) => m.GameModule
          ),
        canActivate: [ReleasedGuard]
      },
      {
        path: 'qr',
        loadChildren: () =>
          import('../../modules/qr/qr.module').then((m) => m.QrModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('../../modules/main/main.module').then((m) => m.MainModule),
        canActivate: [ReleasedGuard]
      },
      {path: '**', pathMatch: 'full', component: PagenotfoundComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullLayoutRoutingModule {
}
