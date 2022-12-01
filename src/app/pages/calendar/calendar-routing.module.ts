import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LunarCalendarComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
