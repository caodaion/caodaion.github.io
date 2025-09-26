import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/navigation/navigation-module').then(m => m.NavigationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Disable default scroll behavior - we'll handle it with our service
    scrollPositionRestoration: 'disabled',
    // Optional: Enable router tracing for debugging
    enableTracing: false
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
