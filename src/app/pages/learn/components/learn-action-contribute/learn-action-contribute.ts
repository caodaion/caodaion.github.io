
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-learn-action-contribute',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    IconComponent,
    MatBottomSheetModule
  ],
  templateUrl: './learn-action-contribute.html',
  styleUrl: './learn-action-contribute.scss'
})
export class LearnActionContribute {
  @ViewChild('learnActionContributeBottomSheet') bottomSheetTpl!: TemplateRef<any>;
  constructor(private bottomSheet: MatBottomSheet) {}

  openBottomSheet(template: TemplateRef<any>) {
    this.bottomSheet.open(template);
  }
}
