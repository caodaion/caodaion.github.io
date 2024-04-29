import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizSectionComponent } from './quiz-section/quiz-section.component';
import { QuizLessonComponent } from './quiz-lesson/quiz-lesson.component';

const routes: Routes = [
  {
    path: '',
    component: QuizComponent,
    children: [
      {
        path: '',
        component: QuizListComponent
      },
      {
        path: ':sectionKey',
        component: QuizSectionComponent
      },
      {
        path: ':sectionKey/:gateKey/:lessonKey',
        component: QuizLessonComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
