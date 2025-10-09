import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Learn } from './learn';
import { Lessons } from './components/lessons/lessons';
import { Lesson } from './components/lesson/lesson';
import { LearnProgressComponent } from './components/learn-progress/learn-progress.component';

const routes: Routes = [
  {
    path: '',
    component: Learn,
    children: [
      {
        path: '',
        component: Lessons
      },
      {
        path: 'tien-do',
        component: LearnProgressComponent
      },
      {
        path: ':slug',
        component: Lesson
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }