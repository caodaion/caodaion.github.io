import { MatPaginatorIntl } from '@angular/material/paginator';
export function getVietnamesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Kết quả mỗi trang';
  paginatorIntl.nextPageLabel = 'Trang tiếp';
  paginatorIntl.previousPageLabel = 'Trang trước';
  paginatorIntl.firstPageLabel = 'Trang đầu';
  paginatorIntl.lastPageLabel = 'Trang cuối';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / 0`;
    }
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };
  return paginatorIntl;
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
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
  IconComponent,
  MatPaginatorModule
  ],
  templateUrl: './learn-progress.component.html',
  styleUrls: ['./learn-progress.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getVietnamesePaginatorIntl }
  ]
})
export class LearnProgressComponent implements OnInit {
  recentActivity: LearnResult[] = [];
  recentActivityTotal = 0;
  recentActivityPageSize = 5;
  recentActivityPageIndex = 0;

  statistics: any = null;

  constructor(
    private learnResultsService: LearnResultsService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadStatistics();
    await this.loadRecentActivityPage();
  }

  async loadStatistics() {
    try {
      this.statistics = await this.learnResultsService.getStatistics();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async loadRecentActivityPage(pageIndex: number = 0, pageSize: number = this.recentActivityPageSize) {
    const { results, total } = await this.learnResultsService.getRecentActivityPage(pageIndex, pageSize);
    this.recentActivity = results;
    this.recentActivityTotal = total;
    this.recentActivityPageIndex = pageIndex;
    this.recentActivityPageSize = pageSize;
  }

  async onRecentActivityPage(event: any) {
    await this.loadRecentActivityPage(event.pageIndex, event.pageSize);
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
