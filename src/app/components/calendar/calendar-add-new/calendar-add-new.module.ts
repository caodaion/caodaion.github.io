import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarAddNewComponent } from './calendar-add-new.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from "../../icon/icon.component";



@NgModule({
  declarations: [
    CalendarAddNewComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    IconComponent
],
  exports: [
    CalendarAddNewComponent
  ]
})
export class CalendarAddNewModule { }
