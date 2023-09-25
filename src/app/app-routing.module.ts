import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule)
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
