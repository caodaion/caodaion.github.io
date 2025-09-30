import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LichComponent } from './lich.component';

const routes: Routes = [
  {
    path: 'share',
    loadComponent: () => import('./components/event-share-page/event-share-page.component').then(m => m.EventSharePageComponent)
  },
  {
    path: '',
    component: LichComponent,
    children: [
      {
        path: 'm/:year/:month',
        loadComponent: () => import('./month-view/month-view.component').then(m => m.MonthViewComponent)
      },
      {
        path: 'w/:year/:month/:day',
        loadComponent: () => import('./week-view/week-view.component').then(m => m.WeekViewComponent)
      },
      {
        path: 'd/:year/:month/:day',
        loadComponent: () => import('./day-view/day-view.component').then(m => m.DayViewComponent)
      },
      {
        path: '',
        redirectTo: 'm/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1),
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LichRoutingModule { }