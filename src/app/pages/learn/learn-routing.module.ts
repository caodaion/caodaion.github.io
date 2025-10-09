import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Learn } from './learn';
import { Lessons } from './components/lessons/lessons';
import { Lesson } from './components/lesson/lesson';
import { LearnProgressComponent } from './components/learn-progress/learn-progress.component';
import { LearnSyncPageComponent } from './components/learn-sync-page/learn-sync-page.component';

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
                path: 'sync',
                component: LearnSyncPageComponent
            },
            {
                path: 'tien-do',
                component: LearnProgressComponent
            },
            {
                path: ':slug',
                component: Lesson
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearnRoutingModule { }