import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KinhListComponent } from './kinh-list/kinh-list.component';
import { KinhRoutingModule } from './kinh-routing.module';
import { KinhContentComponent } from './kinh-content/kinh-content.component';
import { CaodaionEditorModule } from 'src/app/components/caodaion-editor/caodaion-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderModule } from 'src/app/components/header/header.module';
import { BottomNavigatorModule } from 'src/app/components/bottom-navigator/bottom-navigator.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {CpContentCreatorModule} from "../../components/cp-content-creator/cp-content-creator.module";
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MarkdownModule,
    MatButtonToggleModule,
    MatTooltipModule
  ],
})
export class KinhModule {}
