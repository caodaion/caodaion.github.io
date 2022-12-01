import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpToolbarEditorComponent } from './cp-toolbar-editor.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {MatDividerModule} from '@angular/material/divider';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';

@NgModule({
  declarations: [CpToolbarEditorComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [CpToolbarEditorComponent],
})
export class CpToolbarEditorModule {


}
