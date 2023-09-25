import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { EventEditComponent } from './event-edit/event-edit.component';
import { MatRadioModule } from '@angular/material/radio';
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
