import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEventComponent } from './update-event.component';
import { SharedModule } from "../../../shared/shared.module";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DivisionFilterPipe } from "../../../shared/pipe/divisionFilter.pipe";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UpdateKyNiemComponent } from './update-ky-niem/update-ky-niem.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
    declarations: [
        UpdateEventComponent,
        UpdateKyNiemComponent
    ],
    exports: [
        UpdateEventComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatExpansionModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        DivisionFilterPipe,
        MatIconModule,
        MatProgressBarModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDialogModule
    ]
})
export class UpdateEventModule { }
