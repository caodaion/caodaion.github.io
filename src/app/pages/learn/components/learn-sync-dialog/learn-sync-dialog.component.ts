import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { LearnSyncService, LearnSyncData } from '../../services/learn-sync.service';
import { LearnResultsService } from '../../services/learn-results.service';

@Component({
  selector: 'app-learn-sync-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './learn-sync-dialog.component.html',
  styleUrls: ['./learn-sync-dialog.component.scss']
})
export class LearnSyncDialogComponent implements OnInit {
  // Export tab
  syncUrl = '';
  isGenerating = false;
  
  // Import tab
  importUrl = '';
  parsedData: LearnSyncData | null = null;
  isImporting = false;
  mergeStrategy: 'replace' | 'merge' = 'merge';
  
  // Statistics
  currentStats: any = null;
  
  constructor(
    private dialogRef: MatDialogRef<LearnSyncDialogComponent>,
    private learnSyncService: LearnSyncService,
    private learnResultsService: LearnResultsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCurrentStats();
  }

  async loadCurrentStats(): Promise<void> {
    try {
      this.currentStats = await this.learnResultsService.getStatistics();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async generateSyncUrl(): Promise<void> {
    this.isGenerating = true;
    try {
      this.syncUrl = await this.learnSyncService.generateSyncUrl();
      this.snackBar.open('Link đồng bộ đã được tạo thành công!', 'Đóng', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error generating sync URL:', error);
      this.snackBar.open('Không thể tạo link đồng bộ. Vui lòng thử lại.', 'Đóng', {
        duration: 3000
      });
    } finally {
      this.isGenerating = false;
    }
  }

  async copySyncUrl(): Promise<void> {
    if (!this.syncUrl) {
      await this.generateSyncUrl();
    }
    
    if (!this.syncUrl) return;
    
    try {
      await navigator.clipboard.writeText(this.syncUrl);
      this.snackBar.open('Đã sao chép link vào clipboard!', 'Đóng', {
        duration: 3000
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.syncUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      this.snackBar.open('Đã sao chép link vào clipboard!', 'Đóng', {
        duration: 3000
      });
    }
  }

  async shareSyncUrl(): Promise<void> {
    if (!this.syncUrl) {
      await this.generateSyncUrl();
    }
    
    if (!this.syncUrl) return;
    
    try {
      await this.learnSyncService.shareSyncUrl(this.syncUrl);
      this.snackBar.open('Đã chia sẻ link thành công!', 'Đóng', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error sharing sync URL:', error);
      this.snackBar.open('Đã sao chép link vào clipboard!', 'Đóng', {
        duration: 3000
      });
    }
  }

  parseImportUrl(): void {
    if (!this.importUrl.trim()) {
      this.snackBar.open('Vui lòng nhập link đồng bộ', 'Đóng', {
        duration: 3000
      });
      return;
    }
    
    try {
      // Extract data parameter from URL
      const url = new URL(this.importUrl);
      const encodedData = url.searchParams.get('data');
      
      if (!encodedData) {
        throw new Error('Không tìm thấy dữ liệu trong link');
      }
      
      this.parsedData = this.learnSyncService.parseSyncUrl(encodedData);
      this.snackBar.open('Đã phân tích link thành công!', 'Đóng', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error parsing import URL:', error);
      this.snackBar.open('Link không hợp lệ. Vui lòng kiểm tra lại.', 'Đóng', {
        duration: 3000
      });
      this.parsedData = null;
    }
  }

  get importDataInfo() {
    if (!this.parsedData) return null;
    return this.learnSyncService.getSyncDataInfo(this.parsedData);
  }

  async importData(): Promise<void> {
    if (!this.parsedData) {
      this.snackBar.open('Không có dữ liệu để nhập', 'Đóng', {
        duration: 3000
      });
      return;
    }
    
    this.isImporting = true;
    try {
      const result = await this.learnSyncService.importSyncData(this.parsedData, this.mergeStrategy);
      
      let message = `Đã nhập thành công ${result.imported} kết quả`;
      if (result.skipped > 0) {
        message += `, bỏ qua ${result.skipped} kết quả trùng lặp`;
      }
      if (result.errors > 0) {
        message += `, ${result.errors} lỗi`;
      }
      
      this.snackBar.open(message, 'Đóng', {
        duration: 5000
      });
      
      // Reload current stats
      await this.loadCurrentStats();
      
      // Clear import data
      this.parsedData = null;
      this.importUrl = '';
      
    } catch (error) {
      console.error('Error importing data:', error);
      this.snackBar.open('Không thể nhập dữ liệu. Vui lòng thử lại.', 'Đóng', {
        duration: 3000
      });
    } finally {
      this.isImporting = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}