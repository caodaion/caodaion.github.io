import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { EventEditComponent } from './event-edit/event-edit.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [EventListComponent, EventEditComponent, EventDetailsComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    HeaderModule,
    MatExpansionModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [DatePipe],
})
export class EventModule {}
