import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KinhContentComponent } from './kinh-content/kinh-content.component';
import { KinhListComponent } from './kinh-list/kinh-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: KinhListComponent },
      { path: ':kinhKey', component: KinhContentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KinhRoutingModule {}
