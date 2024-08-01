import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnglishRoutingModule } from './english-routing.module';
import { EnglishComponent } from './english.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from "../../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FilterVocabularyPipe } from './filter-vocabulary.pipe';
import { CpMarkdownModule } from "../../components/cp-markdown/cp-markdown.module";
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    EnglishComponent,
    FilterVocabularyPipe,
  ],
  imports: [
    CommonModule,
    EnglishRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    SharedModule,
    MatDialogModule,
    MatDividerModule,
    CpMarkdownModule,
    MatExpansionModule
]
})
export class EnglishModule { }
