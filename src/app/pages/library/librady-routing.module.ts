import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent } from './librarian/librarian.component';
import { BookComponent } from './book/book.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: LibrarianComponent},
      {path: ':key', component: BookComponent},
      {path: ':key/:level', component: BookComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
