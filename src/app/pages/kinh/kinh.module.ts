import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KinhListComponent } from './kinh-list/kinh-list.component';
import { KinhRoutingModule } from './kinh-routing.module';
import { KinhContentComponent } from './kinh-content/kinh-content.component';
import { CaodaionEditorModule } from 'src/app/components/caodaion-editor/caodaion-editor.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderModule } from 'src/app/components/header/header.module';
import { BottomNavigatorModule } from 'src/app/components/bottom-navigator/bottom-navigator.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import {CpContentCreatorModule} from "../../components/cp-content-creator/cp-content-creator.module";

@NgModule({
  declarations: [KinhListComponent, KinhContentComponent],
  imports: [
    CommonModule,
    KinhRoutingModule,
    CaodaionEditorModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    HeaderModule,
    MatExpansionModule,
    BottomNavigatorModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    CpContentCreatorModule,
  ],
})
export class KinhModule {}
