import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JourneyRoutingModule } from './journey-routing.module';
import { JourneyComponent } from './journey.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateJourneyComponent } from './update-journey/update-journey.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    JourneyComponent,
    UpdateJourneyComponent
  ],
  imports: [
    CommonModule,
    JourneyRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    ZXingScannerModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ]
})
export class JourneyModule { }
