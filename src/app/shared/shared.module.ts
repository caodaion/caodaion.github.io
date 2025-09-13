import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SafePipe } from './pipe/safe.pipe';
import { ScrollPositionDirective } from './directives/scroll-position.directive';

@NgModule({
  declarations: [SafePipe],
  imports: [
    CommonModule,
    ScrollPositionDirective
  ],
  exports: [
    SafePipe,
    ScrollPositionDirective
  ],
  providers: [DecimalPipe],
})
export class SharedModule { }
