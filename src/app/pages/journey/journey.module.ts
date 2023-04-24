import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyRoutingModule } from './journey-routing.module';
import { JourneyComponent } from './journey.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CpQrScannerModule } from "../../components/cp-qr-scanner/cp-qr-scanner.module";
import { UpdateJourneyComponent } from './update-journey/update-journey.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AttendanceComponent } from './attendance/attendance.component';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    JourneyComponent,
    UpdateJourneyComponent,
    AttendanceComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    JourneyRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CpQrScannerModule,
    MatTabsModule,
    MatListModule,
    MatInputModule,
    MatDividerModule,
    NgChartsModule,
    MatTableModule,
    MatMenuModule
  ]
})
export class JourneyModule { }
