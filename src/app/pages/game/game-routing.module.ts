import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurifyComponent } from './purify/purify.component';
import { PurifyDetailsComponent } from './purify-details/purify-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'purify',
        pathMatch: 'full'
      },
      { path: 'purify', component: PurifyComponent },
      { path: 'purify/:key', component: PurifyDetailsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
