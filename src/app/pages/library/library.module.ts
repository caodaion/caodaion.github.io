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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BookComponent } from './book/book.component';
import { HeaderModule } from "../../components/header/header.module";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CpContentCreatorModule } from "../../components/cp-content-creator/cp-content-creator.module";
import { BottomNavigatorModule } from "../../components/bottom-navigator/bottom-navigator.module";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MarkdownModule } from 'ngx-markdown';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    declarations: [
        LibrarianComponent,
        BooksComponent,
        BookComponent
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
        MatDividerModule,
        MatCheckboxModule,
        HeaderModule,
        MatProgressBarModule,
        CpContentCreatorModule,
        BottomNavigatorModule,
        MatExpansionModule,
        MatListModule,
        MarkdownModule,
        MatSelectModule,
        MatTooltipModule
    ]
})
export class LibraryModule { }
