import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LunarCalendarComponent } from './lunar-calendar/lunar-calendar.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TinhTuanCuuComponent } from './tinh-tuan-cuu/tinh-tuan-cuu.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [LunarCalendarComponent, TinhTuanCuuComponent],
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
    MatBottomSheetModule,
    MatSnackBarModule,
    QRCodeModule
  ],
  providers: [DatePipe, DecimalPipe],
})
export class CalendarModule {}
