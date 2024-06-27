import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupComponent } from './popup/popup.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { SearchThanhSoPipe } from './pipe/search-thanh-so.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SearchOrganizationPipe } from './pipe/search-organization.pipe';
import { SharedModule } from "../../shared/shared.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { RoutingInstructionsComponent } from './routing-instructions/routing-instructions.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
    declarations: [
        MapsComponent,
        PopupComponent,
        SearchThanhSoPipe,
        SearchOrganizationPipe,
        RoutingInstructionsComponent,
    ],
    imports: [
        CommonModule,
        MapsRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatListModule,
        MatRippleModule,
        MatProgressBarModule,
        MatSelectModule,
        SharedModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatAutocompleteModule,
        ReactiveFormsModule
    ]
})
export class MapsModule { }
