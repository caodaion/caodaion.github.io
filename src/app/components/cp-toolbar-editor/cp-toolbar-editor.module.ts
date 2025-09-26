import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpToolbarEditorComponent } from './cp-toolbar-editor.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import { IconComponent } from "../icon/icon.component";

@NgModule({
  declarations: [CpToolbarEditorComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    IconComponent
],
  exports: [CpToolbarEditorComponent],
})
export class CpToolbarEditorModule {


}
