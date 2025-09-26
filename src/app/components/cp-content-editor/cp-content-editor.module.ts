import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaoDaiONPWAContentEditorComponent } from './cp-content-editor.component';
import { SafeHtmlPipe } from 'src/app/shared/pipe/Safe-html.pipe';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { IconComponent } from "../icon/icon.component";
@NgModule({
  declarations: [CaoDaiONPWAContentEditorComponent,SafeHtmlPipe],
  imports: [CommonModule, MatIconModule, MatButtonModule, IconComponent],
  exports: [CaoDaiONPWAContentEditorComponent],
})
export class CaoDaiONPWAContentEditorModule {}
