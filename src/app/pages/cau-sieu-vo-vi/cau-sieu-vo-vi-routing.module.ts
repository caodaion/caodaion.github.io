import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CauSieuVoViListComponent } from './cau-sieu-vo-vi-list/cau-sieu-vo-vi-list.component';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  { path: '', component: CauSieuVoViListComponent },
  { path: 'them-moi', component: ContentComponent },
  { path: ':_id', component: ContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CauSieuVoViRoutingModule {}
