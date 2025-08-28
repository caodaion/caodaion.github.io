import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { TinhTuanCuuComponent } from '../tinh-tuan-cuu/tinh-tuan-cuu.component';
import { SynchronizedComponent } from './synchronized/synchronized.component';
import { CongPhuComponent } from './cong-phu/cong-phu.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LunarCalendarComponent,
      },
      { path: 'tinh-tuan-cuu', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date/:time', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:year/:month/:date/:time/:details', component: TinhTuanCuuComponent },
      { path: 'cong-phu', component: CongPhuComponent },
      {
        path: ':mode',
        component: LunarCalendarComponent,
      },
      {
        path: ':mode/:year',
        component: LunarCalendarComponent,
      },
      {
        path: ':mode/:year/:month',
        component: LunarCalendarComponent,
      },
      {
        path: ':mode/:year/:month/:date',
        component: LunarCalendarComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule { }
