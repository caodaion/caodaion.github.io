import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../../pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'lich',
        loadChildren: () => import('../../pages/lich/lich.module').then(m => m.LichModule)
      },
      {
        path: 'kinh',
        loadChildren: () => import('../../pages/kinh/kinh/kinh.module').then(m => m.KinhModule)
      },
      {
        path: 'apps',
        loadComponent: () => import('../../pages/apps/apps.component').then(m => m.AppsComponent)
      },
      {
        path: 'tuan-cuu',
        loadChildren: () => import('../../pages/tuan-cuu/tuan-cuu-routing.module').then(m => m.TuanCuuRoutingModule)
      },
      {
        path: 'hoc',
        loadChildren: () => import('../../pages/learn/learn.module').then(m => m.LearnModule)
      },
      {
        path: 'maps',
        loadComponent: () => import('../../pages/maps/maps.component').then(m => m.MapsComponent)
      },
      {
        path: 'weather',
        loadComponent: () => import('../../pages/weather/weather.component').then(m => m.WeatherComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('../../pages/blogger/blogger.component').then(m => m.BloggerComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
