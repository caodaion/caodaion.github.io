import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { TinhTuanCuuComponent } from './tinh-tuan-cuu/tinh-tuan-cuu.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LunarCalendarComponent },
      { path: 'tinh-tuan-cuu', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:token', component: TinhTuanCuuComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
