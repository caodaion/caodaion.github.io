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
import { CaodaiVocabularyComponent } from './caodai-vocabulary/caodai-vocabulary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { YourVocabularyComponent } from './your-vocabulary/your-vocabulary.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    EnglishComponent,
    FilterVocabularyPipe,
    CaodaiVocabularyComponent,
    YourVocabularyComponent,
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
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule
]
})
export class EnglishModule { }
