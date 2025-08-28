import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './layout/navigation/navigation.component';

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
    loadChildren: () => import('./layout/navigation/navigation-module').then(m => m.NavigationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
