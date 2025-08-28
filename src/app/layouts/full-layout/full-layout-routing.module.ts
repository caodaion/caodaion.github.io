import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { FullLayoutComponent } from './full-layout.component';
import { ReleasedGuard } from "../../shared/guards/released.guard";
import { DienThoPhatMauGuard } from 'src/app/shared/guards/dien-tho-phat-mau.guard';
import { TinhTuanCuuComponent } from 'src/app/pages/tinh-tuan-cuu/tinh-tuan-cuu.component';

// Matcher for the profile screen with format /@{username}
export function profileMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 1 && segments[0].path.startsWith('@')) {
    return {
      consumed: segments,
      posParams: {
        username: segments[0]  // Capture the username, including the '@'
      }
    };
  }
  return null;
}

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        matcher: (url) => {
          if (url.length === 1 && url[0].path.startsWith('@')) {
            const username = url[0].path.slice(1); // Remove '@'
            if (username) { // Ensure there's something after '@'
              return {
                consumed: url,
                posParams: {
                  username: new UrlSegment(username, {})
                }
              };
            }
          }
          return null;
        },
        loadChildren: () =>
          import('../../modules/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [ReleasedGuard]
      },
      {
        matcher: (url) => {
          if (url.length === 2 && url[0].path.startsWith('@') && url[1].path === 'guong') {
            const username = url[0].path.slice(1); // Remove '@'
            return {
              consumed: url,
              posParams: {
                username: new UrlSegment(username, {})
              }
            };
          }
          return null;
        },
        loadChildren: () =>
          import('../../modules/guong/guong.module').then((m) => m.GuongModule),
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
        path: 'dien-tho-phat-mau',
        loadChildren: () =>
          import('../../pages/dien-tho-phat-mau/dien-tho-phat-mau.module').then(
            (m) => m.DienThoPhatMauModule
          ),
        canActivate: [DienThoPhatMauGuard]
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('../../modules/apps/apps.module').then((m) => m.AppsModule),
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('../../modules/maps/maps.module').then((m) => m.MapsModule),
      },
      { path: 'tinh-tuan-cuu', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date/:time', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date/:time/:details', component: TinhTuanCuuComponent },
      {
        path: '',
        loadChildren: () =>
          import('../../modules/main/main.module').then((m) => m.MainModule),
        canActivate: [ReleasedGuard]
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullLayoutRoutingModule {
}
