import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from "../../shared/shared.module";
import { MatListModule } from '@angular/material/list';
import { DivisionFilterPipe } from "../../shared/pipe/divisionFilter.pipe";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
    declarations: [
        ProfileComponent
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatDialogModule,
        MatTooltipModule,
        SharedModule,
        MatListModule,
        DivisionFilterPipe,
        MatProgressBarModule,
        MatButtonToggleModule
    ]
})
export class ProfileModule { }
