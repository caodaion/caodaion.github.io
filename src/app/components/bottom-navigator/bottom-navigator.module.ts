import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavigatorComponent } from './bottom-navigator.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [BottomNavigatorComponent],
  imports: [CommonModule, MatListModule, MatDividerModule, MatIconModule],
  exports: [BottomNavigatorComponent],
})
export class BottomNavigatorModule {}
