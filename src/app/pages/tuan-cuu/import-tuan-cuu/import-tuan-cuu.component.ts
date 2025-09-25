import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { TuanCuu, TuanCuuService } from '../services/tuan-cuu.service';
import { CAODAI_TITLE } from '../../../shared/constants/master-data/caodai-title.constant';
import { v4 as uuidv4 } from 'uuid';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";

@Component({
  selector: 'app-import-tuan-cuu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    RouterModule,
    ChildHeaderComponent
  ],
  template: `
    <app-child-header
      [title]="'Nhập dữ liệu Tuần Cửu'"
      [path]="'/tuan-cuu'"
    ></app-child-header>
    <div class="page-container" *ngIf="!isLoading">
      <div *ngIf="errorMessage" class="error-container">
        <mat-icon class="error-icon">error</mat-icon>
        <h2>{{ errorMessage }}</h2>
        <p>Liên kết chia sẻ không hợp lệ hoặc đã hết hạn.</p>
        <button mat-raised-button color="primary" [routerLink]="['/tuan-cuu']">
          Quay lại trang chính
        </button>
      </div>

      <div *ngIf="importData && !errorMessage" class="import-container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Thông tin Tuần Cửu</mat-card-title>
            <mat-card-subtitle
              >Kiểm tra thông tin và lưu vào thiết bị của bạn</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <div class="summary-section" *ngIf="tuanCuuSummary">
              <div class="summary-text">{{ tuanCuuSummary }}</div>
            </div>
            
            <div class="person-info">
              <h3>Thông tin người mất</h3>
              <div class="personal-details">
                <p>
                  <strong>Họ tên:</strong> {{ importData.name }}
                </p>
                <p>
                  <strong>Giới tính:</strong>
                  {{ importData.gender === 'male' ? 'Nam' : 'Nữ' }}
                </p>
                <p *ngIf="importData.age">
                  <strong>Tuổi:</strong> {{ importData.age }}
                </p>
                <p *ngIf="importData.title">
                  <strong>Phẩm đạo:</strong> {{ getTitleDisplayName(importData.title) }}
                </p>
                <p *ngIf="importData.subTitle">
                  <strong>Chức vụ:</strong> {{ getSubTitleDisplayName(importData.title, importData.subTitle) }}
                </p>
                <p *ngIf="importData.holyName">
                  <strong>Thánh danh:</strong> {{ importData.holyName }}
                </p>
                <p *ngIf="importData.color">
                  <strong>Phái:</strong> {{ getColorDisplayName(importData.color) }}
                </p>
                <p>
                  <strong>Ngày mất:</strong> {{ importData.date }}/{{
                    importData.month
                  }}/{{ importData.year }} (Âm lịch)
                </p>
                <p><strong>Thời:</strong> {{ importData.time }}</p>
                <p *ngIf="solarDeathDate">
                  <strong>Dương lịch:</strong> {{ formatDate(solarDeathDate) }}
                </p>
              </div>
            </div>

            <mat-divider class="divider"></mat-divider>

            <h3>Các kỳ Tuần Cửu</h3>
            <div class="events-container">
              <table class="events-table">
                <thead>
                  <tr>
                    <th>Tuần</th>
                    <th>Ngày (âm lịch)</th>
                    <th>Ngày (dương lịch)</th>
                    <th>Thời</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let event of importData.events" [class.next-event]="isNextEvent(event.date)">
                    <td>{{ event.sequence }}</td>
                    <td>{{ formatLunarDate(event.lunarDate) }}</td>
                    <td>{{ event.weekDay }} {{ formatDate(event.date) }}</td>
                    <td>{{ event.eventTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="import-note">
              <p><mat-icon>info</mat-icon> Lưu ý: Thông tin này được chia sẻ bởi người dùng khác. Vui lòng kiểm tra lại trước khi lưu.</p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="saveTuanCuu()">
              <mat-icon>save</mat-icon> Lưu vào thiết bị
            </button>
            <button mat-button [routerLink]="['/tuan-cuu']">Hủy bỏ</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
    <div *ngIf="isLoading" class="loading-container">
      <mat-icon class="loading-icon">hourglass_empty</mat-icon>
      <p>Đang tải dữ liệu...</p>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .error-container {
        text-align: center;
        padding: 40px 20px;
      }
      .error-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #f44336;
        margin-bottom: 20px;
      }
      .import-container {
        margin-top: 20px;
      }
      .summary-section {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 20px;
        border-left: 4px solid #3f51b5;
      }
      .summary-text {
        font-style: italic;
        color: #444;
      }
      .person-info {
        margin-bottom: 20px;
      }
      .personal-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .divider {
        margin: 20px 0;
      }
      .events-container {
        margin-top: 15px;
        overflow-x: auto;
      }
      .events-table {
        width: 100%;
        border-collapse: collapse;
      }
      .events-table th, .events-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .events-table th {
        background-color: #f2f2f2;
      }
      .next-event {
        background-color: rgba(76, 175, 80, 0.15);
        font-weight: 500;
      }
      .import-note {
        margin-top: 20px;
        display: flex;
        align-items: flex-start;
        color: #666;
        font-size: 14px;
      }
      .import-note mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        margin-right: 8px;
        color: #f57c00;
      }
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
      }
      .loading-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 20px;
        animation: spin 2s infinite linear;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @media (max-width: 600px) {
        .personal-details {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  providers: [DatePipe, DecimalPipe, TuanCuuService, CommonService],
})
export class ImportTuanCuuComponent implements OnInit {
  importData: any = null;
  errorMessage: string = '';
  isLoading: boolean = true;
  tuanCuuSummary: string = '';
  solarDeathDate: Date | null = null;
  colorOptions = [
    { value: 'yellow', name: 'Thái' },
    { value: 'blue', name: 'Thượng' },
    { value: 'red', name: 'Ngọc' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private tuanCuuService: TuanCuuService,
    private calendarService: CalendarService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['d']) {
        try {
          // Directly decode the URL-encoded JSON data with abbreviated keys
          const decodedData = decodeURIComponent(params['d']);
          // Parse the JSON data
          const minimalData = JSON.parse(decodedData);

          // Convert abbreviated keys to full property names
          this.importData = {
            name: minimalData.n,
            gender: minimalData.g,
            age: minimalData.a,
            title: minimalData.t,
            subTitle: minimalData.st,
            holyName: minimalData.hn,
            color: minimalData.c,
            date: minimalData.d,
            month: minimalData.m,
            year: minimalData.y,
            time: minimalData.tm,
            et: minimalData.et, // Custom event times
            ei: minimalData.ei, // Custom event indices (optimized format)
            dt: minimalData.dt, // Default time
          };

          // Calculate Tuan Cuu events based on the death date
          this.calculateTuanCuuEvents();
          // Generate summary text
          this.generateTuanCuuSummary();
          this.isLoading = false;

        } catch (error) {
          console.error('Failed to parse imported data:', error);
          this.errorMessage = 'Không thể đọc dữ liệu chia sẻ';
          this.isLoading = false;
        }
      } else if (params['id']) {
        try {
          // Try to load data from localStorage using the provided ID
          const storedData = localStorage.getItem(`tuancuu_share_${params['id']}`);

          if (storedData) {
            // Parse the stored data
            const minimalData = JSON.parse(storedData);

            // Convert abbreviated keys to full property names
            this.importData = {
              name: minimalData.n,
              gender: minimalData.g,
              age: minimalData.a,
              title: minimalData.t,
              subTitle: minimalData.st,
              holyName: minimalData.hn,
              color: minimalData.c,
              date: minimalData.d,
              month: minimalData.m,
              year: minimalData.y,
              time: minimalData.tm,
              et: minimalData.et, // Custom event times
              ei: minimalData.ei, // Custom event indices (optimized format)
              dt: minimalData.dt, // Default time
            };

            // Calculate Tuan Cuu events based on the death date
            this.calculateTuanCuuEvents();
            // Generate summary text
            this.generateTuanCuuSummary();
            this.isLoading = false;
          } else {
            this.errorMessage = 'Dữ liệu chia sẻ đã hết hạn hoặc không tồn tại';
            this.isLoading = false;
          }
        } catch (error) {
          console.error('Failed to load stored data:', error);
          this.errorMessage = 'Không thể đọc dữ liệu chia sẻ';
          this.isLoading = false;
        }
      } else if (params['data']) {
        try {
          // Legacy format - handle as before
          const decodedData = decodeURIComponent(params['data']);
          this.importData = JSON.parse(decodedData);

          // Convert event dates from strings back to Date objects
          if (this.importData.events && this.importData.events.length) {
            this.importData.events = this.importData.events.map(
              (event: any) => {
                return {
                  ...event,
                  date: new Date(event.date),
                };
              }
            );
          }

          // Generate summary text
          this.generateTuanCuuSummary();
          this.isLoading = false;
        } catch (error) {
          console.error('Failed to parse imported data:', error);
          this.errorMessage = 'Không thể đọc dữ liệu chia sẻ';
          this.isLoading = false;
        }
      } else {
        this.errorMessage = 'Không tìm thấy dữ liệu chia sẻ';
        this.isLoading = false;
      }
    });
  }

  // Generate a summary of the Tuần Cửu
  generateTuanCuuSummary(): void {
    if (!this.importData) return;

    try {
      // Convert lunar death date to solar date
      this.solarDeathDate = this.calendarService.getConvertedFullDate({
        lunarDay: this.importData.date,
        lunarMonth: this.importData.month,
        lunarYear: typeof this.importData.year === 'number' ? this.importData.year : parseInt(this.importData.year, 10),
      }).convertLunar2Solar;

      // Find the selected title
      const selectedTitle = CAODAI_TITLE.data.find(
        (title: any) => title.key === this.importData.title
      );
      const eventTitle = selectedTitle?.eventTitle || 'Cầu Siêu';

      // Get title display text
      let titleText = this.getTitleDisplayName(this.importData.title);

      // Get the color name if applicable
      const colorName = this.importData.gender === 'male' && this.importData.color
        ? this.getColorDisplayName(this.importData.color) + ' '
        : '';

      // Get solar date formatted
      const solarDateFormatted = this.solarDeathDate ?
        this.formatDate(this.solarDeathDate) : '';

      // Build the summary string
      this.tuanCuuSummary = `${eventTitle} Cửu cho ${titleText} ${this.importData.holyName || this.importData.name
        }, ${this.importData.age || ''} tuổi, mất thời ${this.importData.time || ''} ngày ${this.importData.date
        }/${this.decimalPipe.transform(this.importData.month, '2.0-0')}/${this.importData.year
        }${solarDateFormatted ? ` (${solarDateFormatted})` : ''}.`;
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  }

  // Calculate Tuan Cuu events based on death date
  calculateTuanCuuEvents(): void {
    if (!this.importData) return;

    // Convert lunar to solar date
    const startDate = this.calendarService.getConvertedFullDate({
      lunarDay: this.importData.date,
      lunarMonth: this.importData.month,
      lunarYear: this.importData.year,
    }).convertLunar2Solar;

    // Save the solar death date
    this.solarDeathDate = new Date(startDate);

    // Use getTuanCuuEvents from CalendarService
    this.calendarService.getTuanCuuEvents(new Date(startDate)).subscribe((events: any[]) => {
      // Convert CalendarService events to the expected format
      // Only take the first 9 events (the traditional Tuần Cửu events)
      const convertedEvents = events?.map((event: any, index: number) => {
        const lunarDate = {
          day: event.lunar?.lunarDay,
          month: event.lunar?.lunarMonth,
          year: event.lunar?.lunarYearName,
          leap: event.lunar?.lunarLeap,
        };

        // Default event time is either the custom default time (dt) or 'Dậu' if not specified
        let eventTime = this.importData.dt || 'Dậu';

        // Handle different formats of custom event times
        // Format 1: Full array in 'et' (old format)
        if (this.importData.et && Array.isArray(this.importData.et) && this.importData.et.length === 9) {
          eventTime = this.importData.et[index] || eventTime;
        }
        // Format 2: Optimized format with indices and values
        else if (
          this.importData.ei &&
          Array.isArray(this.importData.ei) &&
          this.importData.et &&
          Array.isArray(this.importData.et)
        ) {
          // Find if this event index has a custom time
          const customTimeIndex = this.importData.ei.indexOf(index);
          if (customTimeIndex !== -1) {
            eventTime = this.importData.et[customTimeIndex] || eventTime;
          }
        }

        return {
          date: new Date(event.solar),
          lunarDate: lunarDate,
          sequence: event.eventName,
          weekDay: this.commonService.convertDay(
            this.datePipe.transform(event.solar, 'EEE') || ''
          ),
          eventTime: eventTime,
        };
      });

      this.importData.events = convertedEvents;
    });
  }

  // Get display name for title
  getTitleDisplayName(key: string): string {
    const title = CAODAI_TITLE.data.find((item: any) => item.key === key);
    if (title) {
      // For 'chua-co-dao' or 'dao-huu', use the howToAddress field based on gender
      if (key === 'chua-co-dao' || key === 'dao-huu') {
        return title.howToAddress?.[(this.importData.gender as 'male' | 'female')] || title.name;
      }
      return title.name;
    }
    return key;
  }

  // Get subtitle display name
  getSubTitleDisplayName(titleKey: string, subtitleKey: string): string {
    const title = CAODAI_TITLE.data.find((item: any) => item.key === titleKey);
    if (title && title.subTitle) {
      const subtitle = title.subTitle.find((sub: any) => sub.key === subtitleKey);
      return subtitle ? subtitle.name : subtitleKey;
    }
    return subtitleKey;
  }

  // Get color display name
  getColorDisplayName(colorValue: string): string {
    const color = this.colorOptions.find(c => c.value === colorValue);
    return color ? color.name : colorValue;
  }


  // Format date for display
  formatDate(date: string | Date): string {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  // Format lunar date for display
  formatLunarDate(lunarDate?: {
    day: number;
    month: number;
    year: string | number;
    leap: boolean;
  }): string {
    if (!lunarDate) return '';

    return `${this.decimalPipe.transform(lunarDate.day, '2.0-0')}/${this.decimalPipe.transform(lunarDate.month, '2.0-0')
      }${lunarDate.leap ? ' (Nhuận)' : ''}/${lunarDate.year}`;
  }

  // Check if event is the next upcoming one
  isNextEvent(eventDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison

    if (!(eventDate instanceof Date)) {
      eventDate = new Date(eventDate);
    }

    return (
      eventDate >= today &&
      !this.importData.events.some((e: any) => {
        const eDate = e.date instanceof Date ? e.date : new Date(e.date);
        return eDate > today && eDate < eventDate;
      })
    );
  }

  async saveTuanCuu(): Promise<void> {
    try {
      // Create death date
      const deathDate = this.solarDeathDate || this.calendarService.getConvertedFullDate({
        lunarDay: this.importData.date,
        lunarMonth: this.importData.month,
        lunarYear: this.importData.year,
      }).convertLunar2Solar;

      // Get year label
      const yearLabel = this.importData.year;

      // Create a Tuan Cuu object compatible with the service
      const tuanCuu = {
        id: uuidv4(),
        name: this.tuanCuuSummary || `Cầu Siêu Cửu cho ${this.importData.name}`,
        startDate: this.importData.events[0].date,
        endDate: this.importData.events[this.importData.events.length - 1].date,
        events: this.importData.events,
        deceased: {
          name: this.importData.name,
          age: this.importData.age || '',
          gender: this.importData.gender,
          deathDate: deathDate,
          deathLunarDate: {
            day: this.importData.date,
            month: this.importData.month,
            year: yearLabel,
          },
          title: this.importData.title || '',
          subTitle: this.importData.subTitle,
          holyName: this.importData.holyName,
          color: this.importData.color,
          deathTime: this.importData.time,
        },
        summary: this.tuanCuuSummary,
        status: this.tuanCuuService.calculateStatus({
          startDate: this.importData.events[0].date,
          endDate:
            this.importData.events[this.importData.events.length - 1].date,
        } as TuanCuu),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to IndexedDB
      await this.tuanCuuService.addTuanCuu(tuanCuu);

      this.snackBar.open('Đã lưu Tuần Cửu thành công!', 'Đóng', {
        duration: 3000,
      });

      // Navigate to the dashboard
      this.router.navigate(['/tuan-cuu']);
    } catch (error) {
      console.error('Error saving imported Tuan Cuu:', error);
      this.snackBar.open('Lỗi khi lưu dữ liệu!', 'Đóng', {
        duration: 3000,
      });
    }
  }
}
