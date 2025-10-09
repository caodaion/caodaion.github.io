import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LearnResultsService, LearnResult } from '../../services/learn-results.service';
import { IconComponent } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'app-learn-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    IconComponent
  ],
  template: `
    <div class="progress-container">
      <div class="statistics-card">
        <h2>Thống kê học tập</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{statistics?.totalAttempts || 0}}</div>
            <div class="stat-label">Lần thử</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{statistics?.totalLessons || 0}}</div>
            <div class="stat-label">Bài học</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{statistics?.averageScore || 0}}%</div>
            <div class="stat-label">Điểm TB</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{statistics?.bestScore || 0}}%</div>
            <div class="stat-label">Điểm cao nhất</div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h3>Hoạt động gần đây</h3>
        <div *ngIf="statistics?.recentActivity?.length === 0" class="no-results">
          Chưa có kết quả học tập nào
        </div>
        <div *ngFor="let result of statistics?.recentActivity" class="result-item">
          <div class="result-header">
            <h4>{{result.lessonTitle}}</h4>
            <div class="result-score" [class.excellent]="result.percentage >= 80" 
                 [class.good]="result.percentage >= 60 && result.percentage < 80"
                 [class.needs-improvement]="result.percentage < 60">
              {{result.percentage}}%
              @if (result.percentage === 100) {
              <app-icon name="star" size="14px" class="perfect-score-icon"></app-icon>
              }
            </div>
          </div>
          <div class="result-details">
            <span>{{result.correctAnswers}}/{{result.totalQuestions}} đúng</span>
            <span>{{result.completedAt | date:'dd/MM/yyyy HH:mm'}}</span>
            <span *ngIf="result.timeSpent">{{formatTime(result.timeSpent)}}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button mat-raised-button color="warn" (click)="clearAllResults()" 
                [disabled]="!statistics?.totalAttempts">
          <app-icon name="delete"></app-icon>
          Xóa tất cả kết quả
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* CSS Variables for consistent theming */
    :host {
      --surface-color: #ffffff;
      --surface-elevated: #f8f9fa;
      --surface-hover: #f1f3f4;
      --border-color: #e1e4e8;
      --border-light: #f1f3f4;
      --text-primary: #1a1a1a;
      --text-secondary: #5f6368;
      --text-tertiary: #9aa0a6;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
      --success-color: #34a853;
      --warning-color: #ff9800;
      --error-color: #f44336;
      --primary-color: #4285f4;
    }

    .progress-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .statistics-card {
      background: var(--surface-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .statistics-card h2 {
      margin: 0 0 16px 0;
      color: var(--text-primary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: var(--surface-elevated);
      border-radius: 8px;
      border: 1px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .stat-item:hover {
      background: var(--surface-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: var(--success-color);
    }

    .stat-label {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .recent-activity {
      background: var(--surface-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .recent-activity h3 {
      margin: 0 0 16px 0;
      color: var(--text-primary);
    }

    .no-results {
      text-align: center;
      color: var(--text-secondary);
      padding: 32px;
    }

    .result-item {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      background: var(--surface-elevated);
      transition: all 0.2s ease;
    }

    .result-item:hover {
      background: var(--surface-hover);
      border-color: var(--primary-color);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .result-header h4 {
      margin: 0;
      color: var(--text-primary);
      font-size: 16px;
    }

    .result-score {
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
    }

    .result-score.excellent {
      background: var(--success-color);
    }

    .result-score.good {
      background: var(--warning-color);
    }

    .result-score.needs-improvement {
      background: var(--error-color);
    }

    .perfect-score-icon {
      margin-left: 4px;
      color: #ffd700;
      animation: sparkle 1.5s ease-in-out infinite;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    .result-details {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .actions {
      text-align: center;
      padding: 16px;
    }

    /* Dark Mode Support */
    :host-context(.dark-theme) {
      --surface-color: #1f1f1f;
      --surface-elevated: #2a2a2a;
      --surface-hover: #3a3a3a;
      --border-color: #333333;
      --border-light: #2a2a2a;
      --text-primary: #e8eaed;
      --text-secondary: #9aa0a6;
      --text-tertiary: #5f6368;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
      .progress-container {
        padding: 12px;
      }

      .statistics-card,
      .recent-activity {
        padding: 16px;
        margin-bottom: 16px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 12px;
      }

      .stat-item {
        padding: 12px;
      }

      .stat-number {
        font-size: 20px;
      }

      .result-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .result-details {
        flex-direction: column;
        gap: 4px;
      }

      .result-item {
        padding: 12px;
      }
    }
  `]
})
export class LearnProgressComponent implements OnInit {
  statistics: any = null;

  constructor(private learnResultsService: LearnResultsService) {}

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
}