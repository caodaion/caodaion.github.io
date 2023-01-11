import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './librady-routing.module';
import { LibrarianComponent } from './librarian/librarian.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BooksComponent } from './librarian/books/books.component';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    LibrarianComponent,
    BooksComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule
  ]
})
export class LibraryModule { }
