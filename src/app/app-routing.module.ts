import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'caodai100',
    loadChildren: () =>
      import('./pages/caodai100/caodai100.module').then(
        (m) => m.Caodai100Module
      )
  },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/full-layout/full-layout.module').then(
        (m) => m.FullLayoutModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
