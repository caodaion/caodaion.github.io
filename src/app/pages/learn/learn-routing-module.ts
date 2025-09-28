import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Learn } from './learn';
import { Lessons } from './components/lessons/lessons';

const routes: Routes = [
  { path: '',
    component: Learn,
    children: [
      {
        path: '',
        component: Lessons
      }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
