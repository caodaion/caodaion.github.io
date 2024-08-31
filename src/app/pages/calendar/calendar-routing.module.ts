import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { TinhTuanCuuComponent } from './tinh-tuan-cuu/tinh-tuan-cuu.component';
import { SynchronizedComponent } from './synchronized/synchronized.component';
import { CongPhuComponent } from './cong-phu/cong-phu.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LunarCalendarComponent },
      { path: 'tinh-tuan-cuu', component: TinhTuanCuuComponent },
      { path: 'tinh-tuan-cuu/:token', component: TinhTuanCuuComponent },
      // { path: 'dong-bo', component: SynchronizedComponent },
      { path: 'cong-phu', component: CongPhuComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
