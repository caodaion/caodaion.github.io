import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderModule } from "../../components/header/header.module";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizSectionComponent } from './quiz-section/quiz-section.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from "../../shared/shared.module";
import { QuizLessonComponent } from './quiz-lesson/quiz-lesson.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { CpMarkdownModule } from "../../components/cp-markdown/cp-markdown.module";
import { ButtonShareModule } from "../../components/button-share/button-share.module";


@NgModule({
    declarations: [
        QuizComponent,
        QuizListComponent,
        QuizSectionComponent,
        QuizLessonComponent
    ],
    providers: [
        DecimalPipe
    ],
    imports: [
        CommonModule,
        QuizRoutingModule,
        MatTableModule,
        MatListModule,
        MatDividerModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatGridListModule,
        MatCardModule,
        MatExpansionModule,
        FormsModule,
        MatTabsModule,
        MatListModule,
        HeaderModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        DecimalPipe,
        MatProgressBarModule,
        MatRadioModule,
        CpMarkdownModule,
        ButtonShareModule
    ]
})
export class QuizModule { }
