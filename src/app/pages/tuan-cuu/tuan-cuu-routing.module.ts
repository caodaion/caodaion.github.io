import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'tinh',
    loadComponent: () =>
      import('./tuan-cuu-form/tuan-cuu-form.component').then(
        (m) => m.TuanCuuFormComponent
      ),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('./import-tuan-cuu/import-tuan-cuu.component').then(
        (m) => m.ImportTuanCuuComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./tuan-cuu-form/tuan-cuu-form.component').then(
        (m) => m.TuanCuuFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TuanCuuRoutingModule {}
