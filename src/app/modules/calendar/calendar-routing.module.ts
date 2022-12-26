import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from 'src/app/layouts/pagenotfound/pagenotfound.component';
import { CalendarComponent } from './calendar.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../pages/calendar/calendar.module').then((m) => m.CalendarModule),
      },
      {
        path: 'su-kien',
        loadChildren: () =>
          import('../../pages/event/event.module').then((m) => m.EventModule),
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
