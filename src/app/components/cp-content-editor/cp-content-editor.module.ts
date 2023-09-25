import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaoDaiONPWAContentEditorComponent } from './cp-content-editor.component';
import { SafeHtmlPipe } from 'src/app/shared/pipe/Safe-html.pipe';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
@NgModule({
  declarations: [CaoDaiONPWAContentEditorComponent,SafeHtmlPipe],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [CaoDaiONPWAContentEditorComponent],
})
export class CaoDaiONPWAContentEditorModule {}
