import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
import { CauSieuVoViRoutingModule } from './cau-sieu-vo-vi-routing.module';
import { CaodaionEditorModule } from 'src/app/components/caodaion-editor/caodaion-editor.module';
import { CauSieuVoViListComponent } from './cau-sieu-vo-vi-list/cau-sieu-vo-vi-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [ContentComponent, CauSieuVoViListComponent],
  imports: [
    CommonModule,
    CaodaionEditorModule,
    CauSieuVoViRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatTreeModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatRippleModule
  ],
})
export class CauSieuVoViModule {}
