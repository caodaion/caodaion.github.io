import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bcd100RoutingModule } from './bcd100-routing.module';
import { Bcd100Component } from './bcd100.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CollectorComponent } from './collector/collector.component';
import { FormsModule } from '@angular/forms';
import { DivisionFilterPipe } from "../../shared/pipe/divisionFilter.pipe";
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../../shared/shared.module";
import { ViewerComponent } from './viewer/viewer.component';
import { PresentComponent } from './viewer/present/present.component';


@NgModule({
    declarations: [
        Bcd100Component,
        CollectorComponent,
        ViewerComponent,
        PresentComponent
    ],
    imports: [
        CommonModule,
        Bcd100RoutingModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        DivisionFilterPipe,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDialogModule,
        SharedModule
    ]
})
export class Bcd100Module { }
