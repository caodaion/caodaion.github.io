import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SafePipe } from './pipe/safe.pipe';



@NgModule({
  declarations: [SafePipe],
  imports: [
    CommonModule
  ],
  exports: [SafePipe],
  providers: [DecimalPipe],

})
export class SharedModule { }
