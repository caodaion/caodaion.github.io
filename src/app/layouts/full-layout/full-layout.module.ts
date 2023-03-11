import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullLayoutComponent } from './full-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FullLayoutRoutingModule } from './full-layout-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { CaodaionEditorModule } from 'src/app/components/caodaion-editor/caodaion-editor.module';
import { MatBadgeModule } from '@angular/material/badge';
import { KnollModule } from 'src/app/components/knoll/knoll.module';
import { ButtonShareModule } from 'src/app/components/button-share/button-share.module';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    KnollModule,
    ButtonShareModule,
    MatTooltipModule
  ],
  exports: [FullLayoutComponent],
})
export class FullLayoutModule {}
