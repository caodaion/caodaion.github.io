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
        path: 'ca-nhan',
        loadChildren: () => import('../../pages/ca-nhan/ca-nhan-module').then(m => m.CaNhanModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
