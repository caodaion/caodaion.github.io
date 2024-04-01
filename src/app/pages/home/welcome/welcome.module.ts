import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    WelcomeComponent
  ]
})
export class WelcomeModule { }
