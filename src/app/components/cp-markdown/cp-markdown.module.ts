import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpMarkdownComponent } from './cp-markdown.component';
import { MarkdownModule } from 'ngx-markdown';



@NgModule({
  declarations: [
    CpMarkdownComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule
  ],
  exports: [
    CpMarkdownComponent
  ]
})
export class CpMarkdownModule { }
