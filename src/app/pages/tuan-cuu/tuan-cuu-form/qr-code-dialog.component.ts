import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Chia sẻ Tuần Cửu</h2>
    <mat-dialog-content>
      <div class="qr-code-container">
        <img [src]="data.qrCodeDataUrl" alt="QR Code" class="qr-code-image"/>
        <p class="instructions">Quét mã QR để nhập dữ liệu Tuần Cửu</p>
      </div>
      <div class="share-info">
        <p>Tên: <strong>{{ data.name }}</strong></p>
        <p *ngIf="data.isLocalStorageFallback" class="fallback-note">
          <mat-icon class="info-icon">info</mat-icon>
          Lưu ý: Dữ liệu được lưu tạm thời. Liên kết sẽ hết hiệu lực khi xóa bộ nhớ trình duyệt.
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="copyLink()">
        <mat-icon>content_copy</mat-icon> Sao chép liên kết
      </button>
      <button mat-button (click)="nativeShare()" *ngIf="canUseShare">
        <mat-icon>share</mat-icon> Chia sẻ
      </button>
      <button mat-button mat-dialog-close>Đóng</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }
    .qr-code-image {
      width: 240px;
      height: 240px;
      margin: 16px 0;
    }
    .instructions {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .share-info {
      margin-top: 16px;
      border-top: 1px solid #eee;
      padding-top: 16px;
    }
    .fallback-note {
      display: flex;
      align-items: center;
      background-color: rgba(255, 235, 59, 0.2);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      color: #856404;
      margin-top: 12px;
    }
    .info-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      margin-right: 8px;
    }
  `]
})
export class QrCodeDialogComponent {
  canUseShare = !!navigator.share;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      qrCodeDataUrl: string;
      name: string;
      shareUrl: string;
      isLocalStorageFallback?: boolean;
    },
    private dialogRef: MatDialogRef<QrCodeDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  copyLink(): void {
    navigator.clipboard.writeText(this.data.shareUrl)
      .then(() => {
        this.snackBar.open('Đã sao chép liên kết chia sẻ!', 'Đóng', {
          duration: 3000
        });
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        this.snackBar.open('Không thể sao chép liên kết!', 'Đóng', {
          duration: 3000
        });
      });
  }

  nativeShare(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Chia sẻ Tuần Cửu',
        text: `Thông tin Tuần Cửu cho ${this.data.name}`,
        url: this.data.shareUrl
      }).catch((error) => console.error('Error sharing:', error));
    }
  }
}