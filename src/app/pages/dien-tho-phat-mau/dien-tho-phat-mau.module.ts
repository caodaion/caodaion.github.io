import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DienThoPhatMauComponent } from './dien-tho-phat-mau.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';


const routes: Routes = [
  {
    path: '',
    component: DienThoPhatMauComponent
  }
];

@NgModule({
  declarations: [
    DienThoPhatMauComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class DienThoPhatMauModule { }
