import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent } from './librarian/librarian.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: LibrarianComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
