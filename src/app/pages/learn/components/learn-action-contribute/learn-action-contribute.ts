
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'app-learn-action-contribute',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    IconComponent
  ],
  templateUrl: './learn-action-contribute.html',
  styleUrl: './learn-action-contribute.scss'
})
export class LearnActionContribute {
  openContributionDialog() {
    // TODO: Hiển thị dialog đóng góp
    alert('Tính năng đóng góp sẽ sớm ra mắt!');
  }
}
