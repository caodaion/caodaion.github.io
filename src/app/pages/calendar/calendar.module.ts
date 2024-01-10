import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TinhTuanCuuComponent } from './tinh-tuan-cuu/tinh-tuan-cuu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonShareModule } from 'src/app/components/button-share/button-share.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { SynchronizedComponent } from './synchronized/synchronized.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [LunarCalendarComponent, TinhTuanCuuComponent, SynchronizedComponent],
  providers: [DatePipe, DecimalPipe],
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
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatExpansionModule,
    MatRadioModule,
    MatMenuModule,
    MatSnackBarModule,
    ButtonShareModule,
    QRCodeModule,
    NgxMatTimepickerModule,
    SharedModule
  ]
})
export class CalendarModule { }
