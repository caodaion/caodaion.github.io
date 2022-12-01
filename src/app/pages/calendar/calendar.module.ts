import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LunarCalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [DatePipe],
})
export class CalendarModule {}
