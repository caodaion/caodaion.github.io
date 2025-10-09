import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LearnResultsService, LearnResult } from '../../services/learn-results.service';
import { LearnSyncDialogComponent } from '../learn-sync-dialog/learn-sync-dialog.component';
import { IconComponent } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'app-learn-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    IconComponent
  ],
  templateUrl: './learn-progress.component.html',
  styleUrls: ['./learn-progress.component.scss']
})
export class LearnProgressComponent implements OnInit {
  statistics: any = null;

  constructor(
    private learnResultsService: LearnResultsService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadStatistics();
  }

  async loadStatistics() {
    try {
      this.statistics = await this.learnResultsService.getStatistics();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async clearAllResults() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả kết quả học tập? Hành động này không thể hoàn tác.')) {
      try {
        await this.learnResultsService.clearAllResults();
        await this.loadStatistics();
      } catch (error) {
        console.error('Error clearing results:', error);
      }
    }
  }

  openSyncDialog(): void {
    const dialogRef = this.dialog.open(LearnSyncDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // Reload statistics in case data was imported
      this.loadStatistics();
    });
  }
}
