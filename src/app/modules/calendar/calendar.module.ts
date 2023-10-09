import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarAddNewModule } from 'src/app/components/calendar/calendar-add-new/calendar-add-new.module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    CalendarRoutingModule,
    CalendarAddNewModule,
    NgxMatTimepickerModule
  ]
})
export class CalendarModule { }
