import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';

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
        path: ':doc',
        component: QuizDetailsComponent
      },
      {
        path: ':doc/:article',
        component: QuizDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
