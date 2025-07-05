import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '100',
    loadChildren: () =>
      import('./pages/bcd100/bcd100.module').then(
        (m) => m.Bcd100Module
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
