import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ChildHeaderComponent } from 'src/app/components/child-header/child-header.component';
import { LearnSyncService, LearnSyncData } from '../../services/learn-sync.service';
import { LearnResultsService } from '../../services/learn-results.service';

@Component({
  selector: 'app-learn-sync-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDividerModule,
    FormsModule,
    ChildHeaderComponent
  ],
  templateUrl: './learn-sync-page.component.html',
  styleUrls: ['./learn-sync-page.component.scss']
})
export class LearnSyncPageComponent implements OnInit {
  syncData: LearnSyncData | null = null;
  isLoading = true;
  error: string | null = null;
  isImporting = false;
  importComplete = false;
  mergeStrategy: 'replace' | 'merge' = 'merge';
  importResult: any = null;
  currentStats: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private learnSyncService: LearnSyncService,
    private learnResultsService: LearnResultsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCurrentStats();
    
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.syncData = this.learnSyncService.parseSyncUrl(params['data']);
          this.isLoading = false;
        } catch (error) {
          console.error('Error parsing sync data:', error);
          this.error = 'Không thể tải dữ liệu đồng bộ. Link có thể bị hỏng hoặc không hợp lệ.';
          this.isLoading = false;
        }
      } else {
        this.error = 'Không tìm thấy dữ liệu đồng bộ trong link';
        this.isLoading = false;
      }
    });
  }

  async loadCurrentStats(): Promise<void> {
    try {
      this.currentStats = await this.learnResultsService.getStatistics();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  get syncDataInfo() {
    if (!this.syncData) return null;
    return this.learnSyncService.getSyncDataInfo(this.syncData);
  }

  async importData(): Promise<void> {
    if (!this.syncData) return;
    
    this.isImporting = true;
    try {
      this.importResult = await this.learnSyncService.importSyncData(this.syncData, this.mergeStrategy);
      
      let message = `Đã nhập thành công ${this.importResult.imported} kết quả`;
      if (this.importResult.skipped > 0) {
        message += `, bỏ qua ${this.importResult.skipped} kết quả trùng lặp`;
      }
      if (this.importResult.errors > 0) {
        message += `, ${this.importResult.errors} lỗi`;
      }
      
      this.snackBar.open(message, 'Đóng', {
        duration: 5000
      });
      
      this.importComplete = true;
      
      // Reload current stats
      await this.loadCurrentStats();
      
    } catch (error) {
      console.error('Error importing data:', error);
      this.snackBar.open('Không thể nhập dữ liệu. Vui lòng thử lại.', 'Đóng', {
        duration: 3000
      });
    } finally {
      this.isImporting = false;
    }
  }

  goToLearn(): void {
    this.router.navigate(['/hoc']);
  }

  goBack(): void {
    this.router.navigate(['/hoc']);
  }
}