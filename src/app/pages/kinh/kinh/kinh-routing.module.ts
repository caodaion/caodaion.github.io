import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KinhListComponent } from '../components/kinh-list/kinh-list.component';
import { KinhDetailComponent } from '../components/kinh-detail/kinh-detail.component';

const routes: Routes = [
  { path: '', component: KinhListComponent },
  { path: ':key', component: KinhDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KinhRoutingModule { }
