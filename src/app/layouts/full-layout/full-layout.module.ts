import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullLayoutComponent } from './full-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FullLayoutRoutingModule } from './full-layout-routing.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { CaodaionEditorModule } from 'src/app/components/caodaion-editor/caodaion-editor.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FullLayoutComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    FullLayoutRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    MatMenuModule,
    MatBadgeModule,
    CaodaionEditorModule,
    MatCheckboxModule,
    FormsModule
  ],
  exports: [FullLayoutComponent],
})
export class FullLayoutModule {}
