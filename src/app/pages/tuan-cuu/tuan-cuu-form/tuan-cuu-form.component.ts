import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../../shared/services/calendar/calendar.service';
import { CommonService } from '../../../shared/services/common.service';
import { CAODAI_TITLE } from '../../../shared/constants/master-data/caodai-title.constant';
import { TuanCuu, TuanCuuService } from '../services/tuan-cuu.service';
import { QrCodeDialogComponent } from './qr-code-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";
import { IconComponent } from "src/app/components/icon/icon.component";

// Interface for form data
interface TuanCuuFormData {
  calendarType: 'lunar' | 'solar';
  date: number;
  month: number;
  year: any;
  time: any;
  events: TuanCuuEvent[];
  // New personal details fields
  name: string;
  age?: any;
  gender: 'male' | 'female';
  title: string;
  subTitle?: string;
  holyName?: string;
  color?: string;
}

// Interface for event
interface TuanCuuEvent {
  date: Date;
  weekDay: any;
  lunarDate?: { day: number; month: number; year: number | string; leap: boolean };
  sequence: any;
  eventTime: string; // Time for the event ceremony, default is "Dậu"
}

@Component({
  selector: 'app-tuan-cuu-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChildHeaderComponent,
    IconComponent
  ],
  templateUrl: './tuan-cuu-form.component.html',
  styleUrl: './tuan-cuu-form.component.scss',
  providers: [
    DatePipe,
    CalendarService,
    DecimalPipe,
    CommonService,
    TuanCuuService,
  ],
})
export class TuanCuuFormComponent implements OnInit {
  // Form data model
  formData: TuanCuuFormData = {
    calendarType: 'lunar', // Default to lunar
    date: new Date().getDate(),
    month: new Date().getMonth() + 1, // JavaScript months are 0-based
    year: new Date().getFullYear(),
    time: 'Tý', // Default to 'Tý' (first animal in the lunar time cycle)
    events: [],
    name: '',
    age: '',
    gender: 'male',
    title: '',
    holyName: '',
    color: '',
  };

  // Error flags
  formErrors: { [key: string]: boolean } = {
    name: false,
    title: false,
  };

  // Edit mode
  isEditMode = false;
  tuanCuuId: string | null = null;

  // Panel state
  expanded = false;

  // Options for dropdowns
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: any[] = [];

  // Cao Dai titles for selection
  caodaiTitles = CAODAI_TITLE.data;

  // Subtitles for Chuc Viec if selected
  subTitles: any[] = [];

  // Color options
  colorOptions = [
    { value: 'yellow', name: 'Thái' },
    { value: 'blue', name: 'Thượng' },
    { value: 'red', name: 'Ngọc' },
  ];

  // Lunar time options (twelve animals)
  lunarTimeOptions = [
    'Tý',
    'Sửu',
    'Dần',
    'Mão',
    'Thìn',
    'Tị',
    'Ngọ',
    'Mùi',
    'Thân',
    'Dậu',
    'Tuất',
    'Hợi',
  ];

  // Solar time options (24 hours)
  solarTimeOptions = Array.from({ length: 24 }, (_, i) => i);

  // Table columns
  displayedColumns: string[] = ['sequence', 'lunarDate', 'date', 'eventTime'];

  private subscriptions: Subscription[] = [];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private decimalPipe: DecimalPipe,
    private commonService: CommonService,
    private tuanCuuService: TuanCuuService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.expanded = false;
    this.years = Array.from({ length: 100 }, (_, i) => {
      const iDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 50 + i)
      );
      return {
        value: iDate.getFullYear(),
        label:
          this.calendarService.getConvertedFullDate(iDate).convertSolar2Lunar
            ?.lunarYearName,
      };
    });
    // Check if we're in create or edit mode
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && id !== 'tinh') {
        this.isEditMode = true;
        this.tuanCuuId = id;
        this.loadExistingTuanCuu(id);
      } else if (this.router.url.includes('/tinh')) {
        this.expanded = true;
        const newDate = params.get('newDate');
        if (newDate) {
          const convertedLunar = this.calendarService.getConvertedFullDate(new Date(newDate)).convertSolar2Lunar;
          this.formData.date = convertedLunar.lunarDay;
          this.formData.month = convertedLunar.lunarMonth;
          this.formData.year = convertedLunar.lunarYear;
        } else {
          this.setDefaultDates();
        }
      }
    });

    // Check if we should scroll to action buttons (from event image dialog)
    this.route.queryParams.subscribe(params => {
      if (params['scrollToActions'] === 'true') {
        setTimeout(() => {
          this.scrollToActionButtons();
        }, 1000); // Wait for page to load
      }
    });
  }

  private scrollToActionButtons(): void {
    const actionButtons = document.querySelector('.form-actions');
    if (actionButtons) {
      actionButtons.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Show a helpful message
      this.snackBar.open('Cuộn đến nút "Gửi đến Google Calendar" để gửi tất cả sự kiện tuần cửu!', 'Đóng', {
        duration: 5000,
      });
    }
  }

  // Load existing Tuan Cuu data for editing
  async loadExistingTuanCuu(id: string): Promise<void> {
    try {
      const tuanCuu = await this.tuanCuuService.getTuanCuuById(id);
      if (tuanCuu) {
        // Populate form data from existing record
        this.formData.calendarType = 'lunar'; // Default to lunar
        this.formData.name = tuanCuu.deceased.name;
        this.formData.age = tuanCuu.deceased.age;
        this.formData.gender = tuanCuu.deceased.gender as 'male' | 'female';
        this.formData.title = tuanCuu.deceased.title;
        this.formData.subTitle = tuanCuu.deceased.subTitle;
        this.formData.holyName = tuanCuu.deceased.holyName;
        this.formData.color = tuanCuu.deceased.color;

        // If there's a death lunar date, use it
        if (tuanCuu.deceased.deathLunarDate) {
          this.formData.date = tuanCuu.deceased.deathLunarDate.day;
          this.formData.month = tuanCuu.deceased.deathLunarDate.month;
          this.formData.year = tuanCuu.deceased.deathDate.getFullYear(); // Use the year from the death date
        } else {
          // Otherwise convert from solar date
          const lunar = this.calendarService.getConvertedFullDate(
            tuanCuu.deceased.deathDate
          ).convertSolar2Lunar;
          this.formData.date = lunar.lunarDay;
          this.formData.month = lunar.lunarMonth;
          this.formData.year = lunar.lunarYear;
        }

        this.formData.time = tuanCuu.deceased.deathTime;
        this.formData.events = tuanCuu.events;

        // Only expand the panel if the URL includes '/tinh'
        if (this.router.url.includes('/tinh')) {
          this.expanded = true;
        }

        // If title is Chuc Viec, load subtitles
        if (tuanCuu.deceased.title === 'chuc-viec') {
          this.onTitleChange('chuc-viec');
        }
        console.log(this.formData);

      } else {
        this.snackBar.open('Không tìm thấy dữ liệu Tuần Cửu!', 'Đóng', {
          duration: 3000,
        });
        this.router.navigate(['/tuan-cuu']);
      }
    } catch (error) {
      this.snackBar.open('Lỗi khi tải dữ liệu!', 'Đóng', {
        duration: 3000,
      });
      console.error('Error loading Tuan Cuu data:', error);
    }
  }

  // Set the default date values based on current date
  setDefaultDates(): void {
    const today = new Date();

    if (this.formData.calendarType === 'lunar') {
      // Get lunar date for today
      const lunar =
        this.calendarService.getConvertedFullDate(today)?.convertSolar2Lunar;
      this.formData.date = lunar.lunarDay;
      this.formData.month = lunar.lunarMonth;
      this.formData.year = lunar.lunarYear;
      this.formData.time = lunar.lunarTime || 'Tý'; // Default to 'Tý' if not available
    } else {
      // Solar date
      this.formData.date = today.getDate();
      this.formData.month = today.getMonth() + 1;
      this.formData.year = today.getFullYear();
    }
  }

  // Handle calendar type change
  onCalendarTypeChange(): void {
    this.setDefaultDates();
  }

  // Handle title selection
  onTitleChange(titleKey: string): void {
    // Find the selected title
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === titleKey
    );

    // Check if this title is Chuc Viec which has subtitles
    if (
      selectedTitle &&
      (selectedTitle.key === 'chuc-viec' || selectedTitle.key === 'bao-quan' || selectedTitle.key === 'thoi-quan') &&
      selectedTitle.subTitle
    ) {
      this.subTitles = selectedTitle.subTitle;
    } else {
      this.subTitles = [];
    }

    // Clear holy name and color if not required
    if (selectedTitle && !selectedTitle.isHolyNameRequired) {
      this.formData.holyName = '';
      this.formData.color = '';
    }
  }

  // Check if holy name is required
  isHolyNameRequired(): boolean {
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.formData.title
    );
    return selectedTitle ? !!selectedTitle.isHolyNameRequired : false;
  }

  // Check if color selection should be shown (for male with holy name required)
  shouldShowColorSelection(): boolean {
    return this.formData.gender === 'male' && this.isHolyNameRequired();
  }

  // Calculate Tuan Cuu events
  calculateEvents(): void {
    // Clear previous events
    this.formData.events = [];

    // Convert lunar to solar if needed
    let startDate: Date;

    if (this.formData.calendarType === 'lunar') {
      const lunarYear = this.formData.year;
      const lunarMonth = this.formData.month;
      const lunarDay = this.formData.date;

      // Using a valid approach to convert lunar to solar date
      startDate = this.calendarService.getConvertedFullDate({
        lunarDay: lunarDay,
        lunarMonth: lunarMonth,
        lunarYear: lunarYear,
      }).convertLunar2Solar;
    } else {
      // Use solar date directly
      startDate = new Date(
        this.formData.year,
        this.formData.month - 1,
        this.formData.date
      );
    }

    // Use getTuanCuuEvents from CalendarService
    // Create a copy of startDate to avoid mutation in the service
    this.calendarService.getTuanCuuEvents(new Date(startDate)).subscribe((events: any[]) => {
      // Convert CalendarService events to TuanCuuEvent format
      // Only take the first 9 events (the traditional Tuần Cửu events)
      this.formData.events = events?.map((event: any, index: number) => {
        const lunarDate = {
          day: event.lunar?.lunarDay,
          month: event.lunar?.lunarMonth,
          year: event.lunar?.lunarYearName,
          leap: event.lunar?.lunarLeap,
        };

        return {
          date: new Date(event.solar),
          lunarDate: lunarDate,
          sequence: event.eventName,
          weekDay: this.commonService.convertDay(
            this.datePipe.transform(event.solar, 'EEE') || ''
          ),
          eventTime: 'Dậu', // Default event time
        };
      });

      // Expand the panel to show results
      this.expanded = true;
    });
  }

  // Format date for display
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  // Print Tuan Cuu information in A4 format
  printTuanCuu(): void {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.snackBar.open('Vui lòng cho phép cửa sổ pop-up để in!', 'Đóng', {
        duration: 3000,
      });
      return;
    }

    // Find title and color information
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.formData.title
    );
    const selectedColor = this.colorOptions.find(
      (color) => color.value === this.formData.color
    )?.name || '';

    // Create minimal data object for QR code sharing
    const minimalData = {
      n: this.formData.name,
      g: this.formData.gender,
      a: this.formData.age,
      t: this.formData.title,
      st: this.formData.subTitle,
      hn: this.formData.holyName,
      c: this.formData.color,
      d: this.formData.date,
      m: this.formData.month,
      y: this.formData.year,
      tm: this.formData.time
    };

    // Convert to JSON and encode
    const jsonData = JSON.stringify(minimalData);
    const encodedData = encodeURIComponent(jsonData);

    // Create shareable URL with the data as a query parameter
    const baseUrl = window.location.origin + '/tuan-cuu/import';
    const shareableUrl = `${baseUrl}?d=${encodedData}`;

    // Generate QR code for print
    QRCode.toDataURL(shareableUrl, {
      errorCorrectionLevel: 'L',
      margin: 1,
      scale: 3
    }).then(qrCodeDataUrl => {
      // Generate print HTML content with QR code
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tuần Cửu - ${this.formData.name}</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1.5cm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary {
              margin-bottom: 20px;
              font-style: italic;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 4px solid #3f51b5;
              border-radius: 0 4px 4px 0;
            }
            .personal-info {
              margin-bottom: 20px;
            }
            .personal-info div {
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .next-event {
              background-color: rgba(76, 175, 80, 0.15);
              font-weight: 500;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .qr-code-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 10px;
            }
            .qr-code-image {
              width: 180px;
              height: 180px;
              margin-bottom: 5px;
            }
            .qr-code-label {
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .watermark {
              position: fixed;
              bottom: 10px;
              right: 10px;
              opacity: 0.5;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">THÔNG TIN TUẦN CỬU</div>
          </div>

          <div class="summary">
            ${this.getTuanCuuSummary()}
          </div>

          <div class="personal-info">
            <div style="display: flex; justify-content: space-between; width: 100%"><span><strong>Họ tên:</strong>${this.formData.name}</span> ${this.formData.age ? `<span><strong>Tuổi:</strong> ${this.formData.age}</span>` : ''}<span><strong>Giới tính:</strong> ${this.formData.gender === 'male' ? 'Nam' : 'Nữ'}</span></div>
            <div style="display: flex; justify-content: space-between; width: 100%"><span><strong>Phẩm vị:</strong> ${selectedTitle?.name || ''}</span>${selectedColor ? `<span><strong>Phái:</strong> ${selectedColor}</span>` : ''}${this.formData.holyName ? `<span><strong>Thánh danh:</strong> ${this.formData.holyName}</span>` : ''}</div>
            ${this.formData.subTitle ? `<div><strong>Chức vụ:</strong> ${this.subTitles.find(s => s.key === this.formData.subTitle)?.name || ''}</div>` : ''}
            <div><strong>Mất lúc:</strong> ${this.formData.time} ngày ${this.formData.date}/${this.formData.month}/${this.formData.year} (Âm lịch)</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tuần</th>
                <th>Ngày (âm lịch)</th>
                <th>Ngày (dương lịch)</th>
                <th>Thời</th>
              </tr>
            </thead>
            <tbody>
              ${this.formData.events.map(event => `
                <tr class="${this.isNextEvent(event.date) ? 'next-event' : ''}">
                  <td>${event.sequence}</td>
                  <td>${this.formatLunarDate(event.lunarDate)}</td>
                  <td>${event.weekDay} ${this.formatDate(event.date)}</td>
                  <td>${event.eventTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <p>Mỗi Tuần Cửu cách nhau 9 ngày từ Khai Cửu cho đến Chung Cửu.</p>
              <p>Tuần tiểu tường được tính kể từ ngày mất 12 tháng âm lịch.</p>
              <p>Tuần đại tường được tính kể từ tiểu tường 12 tháng âm lịch.</p>
            </div>
            <div class="qr-code-container">
              <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code-image"/>
              <div class="qr-code-label">Quét mã QR để nhập dữ liệu Tuần Cửu</div>
            </div>
          </div>

          <div class="watermark">
            CaoDaiON - App tính Tuần Cửu - www.caodaion.com
          </div>
        </body>
        </html>
      `;

      // Write to print window
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // After print window is loaded, trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }).catch(error => {
      console.error('Error generating QR code for print:', error);

      // Still print without QR code if there was an error
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tuần Cửu - ${this.formData.name}</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1.5cm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary {
              margin-bottom: 20px;
              font-style: italic;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 4px solid #3f51b5;
              border-radius: 0 4px 4px 0;
            }
            .personal-info {
              margin-bottom: 20px;
            }
            .personal-info div {
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .next-event {
              background-color: rgba(76, 175, 80, 0.15);
              font-weight: 500;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            .watermark {
              position: fixed;
              bottom: 10px;
              right: 10px;
              opacity: 0.5;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">THÔNG TIN TUẦN CỬU</div>
          </div>

          <div class="summary">
            ${this.getTuanCuuSummary()}
          </div>

          <div class="personal-info">
            <div style="display: flex; justify-content: space-between; width: 100%"><span><strong>Họ tên:</strong>${this.formData.name}</span> ${this.formData.age ? `<span><strong>Tuổi:</strong> ${this.formData.age}</span>` : ''}<span><strong>Giới tính:</strong> ${this.formData.gender === 'male' ? 'Nam' : 'Nữ'}</span></div>
            <div style="display: flex; justify-content: space-between; width: 100%"><span><strong>Phẩm vị:</strong> ${selectedTitle?.name || ''}</span>${selectedColor ? `<span><strong>Phái:</strong> ${selectedColor}</span>` : ''}${this.formData.holyName ? `<span><strong>Thánh danh:</strong> ${this.formData.holyName}</span>` : ''}</div>
            ${this.formData.subTitle ? `<div><strong>Chức vụ:</strong> ${this.subTitles.find(s => s.key === this.formData.subTitle)?.name || ''}</div>` : ''}
            <div><strong>Mất lúc:</strong> ${this.formData.time} ngày ${this.formData.date}/${this.formData.month}/${this.formData.year} (Âm lịch)</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tuần</th>
                <th>Ngày (âm lịch)</th>
                <th>Ngày (dương lịch)</th>
                <th>Thời</th>
              </tr>
            </thead>
            <tbody>
              ${this.formData.events.map(event => `
                <tr class="${this.isNextEvent(event.date) ? 'next-event' : ''}">
                  <td>${event.sequence}</td>
                  <td>${this.formatLunarDate(event.lunarDate)}</td>
                  <td>${event.weekDay} ${this.formatDate(event.date)}</td>
                  <td>${event.eventTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Mỗi Tuần Cửu cách nhau 9 ngày từ Khai Cửu cho đến Chung Cửu.</p>
            <p>Tuần tiểu tường được tính kể từ ngày mất 12 tháng âm lịch.</p>
            <p>Tuần đại tường được tính kể từ tiểu tường 12 tháng âm lịch.</p>
          </div>

          <div class="watermark">
            CaoDaiON - App tính Tuần Cửu - www.caodaion.com
          </div>
        </body>
        </html>
      `;

      // Write to print window
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // After print window is loaded, trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    });
  }

  // Share Tuan Cuu as a shareable link
  shareAsLink(): void {
    if (!this.validateForm()) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc!', 'Đóng', {
        duration: 3000,
      });
      return;
    }

    try {
      // Create a minimal data object with only essential information
      // Instead of sharing all event details, just share the core parameters needed to recalculate them
      const minimalData: Record<string, any> = {
        n: this.formData.name,
        g: this.formData.gender,
        a: this.formData.age,
        t: this.formData.title,
        st: this.formData.subTitle,
        hn: this.formData.holyName,
        c: this.formData.color,
        d: this.formData.date,
        m: this.formData.month,
        y: this.formData.year,
        tm: this.formData.time,
      };

      // Determine if there's a more common event time than "Dậu"
      const timeCounts: Record<string, number> = {};
      this.formData.events.forEach(event => {
        timeCounts[event.eventTime] = (timeCounts[event.eventTime] || 0) + 1;
      });

      // Find the most common time
      let mostCommonTime = 'Dậu';
      let maxCount = 0;

      Object.entries(timeCounts).forEach(([time, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonTime = time;
        }
      });

      // If the most common time is not "Dậu" and appears in more than half the events,
      // use it as the default time to save space
      if (mostCommonTime !== 'Dậu' && timeCounts[mostCommonTime] >= 5) {
        minimalData['dt'] = mostCommonTime; // Add default time

        // Now only include events that differ from this default time
        const customTimeIndices: number[] = [];
        const customTimes: string[] = [];

        this.formData.events.forEach((event, index) => {
          if (event.eventTime !== mostCommonTime) {
            customTimeIndices.push(index);
            customTimes.push(event.eventTime);
          }
        });

        // Only add custom times if there are any
        if (customTimeIndices.length > 0) {
          minimalData['ei'] = customTimeIndices;
          minimalData['et'] = customTimes;
        }
      } else {
        // Fallback to the original approach when "Dậu" is still common
        // or when there's no clear majority time
        const customTimeIndices: number[] = [];
        const customTimes: string[] = [];

        this.formData.events.forEach((event, index) => {
          if (event.eventTime !== 'Dậu') {
            customTimeIndices.push(index);
            customTimes.push(event.eventTime);
          }
        });

        // Only add to the shared data if there are custom times
        if (customTimeIndices.length > 0) {
          minimalData['ei'] = customTimeIndices; // Indices of events with custom times
          minimalData['et'] = customTimes; // The custom time values
        }
      }

      // Convert to JSON and compress by removing unnecessary whitespace
      const jsonData = JSON.stringify(minimalData);

      // Use LZString for compression if the data is still too large
      // Otherwise, use simple URL encoding
      const encodedData = encodeURIComponent(jsonData);

      // Create a shareable URL with the data as a query parameter
      const baseUrl = window.location.origin + '/tuan-cuu/import';
      const shareableUrl = `${baseUrl}?d=${encodedData}`;

      // Generate QR code with a lower error correction level to allow more data
      QRCode.toDataURL(shareableUrl, {
        errorCorrectionLevel: 'L',  // Use 'L' (low) instead of 'H' (high) to allow more data
        margin: 1,                  // Reduce margins to fit more data
        scale: 4                    // Adjust scale for better scanning
      })
        .then((qrCodeDataUrl) => {
          // Open QR code dialog
          this.dialog.open(QrCodeDialogComponent, {
            data: {
              qrCodeDataUrl,
              shareUrl: shareableUrl,
              name: this.formData.name
            },
          });
        })
        .catch((error) => {
          console.error('Error generating QR code:', error);

          // If QR code generation fails, fall back to a simpler approach
          // Just generate a QR code for the base URL and pass the ID
          const fallbackId = this.tuanCuuId || uuidv4();
          const fallbackUrl = `${window.location.origin}/tuan-cuu/import?id=${fallbackId}`;

          // Save the data to localStorage as a fallback
          try {
            localStorage.setItem(`tuancuu_share_${fallbackId}`, jsonData);

            QRCode.toDataURL(fallbackUrl, {
              errorCorrectionLevel: 'L',
              margin: 1
            }).then(qrCodeDataUrl => {
              this.dialog.open(QrCodeDialogComponent, {
                data: {
                  qrCodeDataUrl,
                  shareUrl: fallbackUrl,
                  name: this.formData.name,
                  isLocalStorageFallback: true
                },
              });
            }).catch(fallbackError => {
              this.snackBar.open('Không thể tạo mã QR. Vui lòng sử dụng liên kết để chia sẻ.', 'Đóng', {
                duration: 3000,
              });
              console.error('Fallback QR code generation failed:', fallbackError);
            });
          } catch (localStorageError) {
            this.snackBar.open('Lỗi khi tạo mã QR! Dữ liệu quá lớn.', 'Đóng', {
              duration: 3000,
            });
          }
        });
    } catch (error) {
      console.error('Error creating shareable link:', error);
      this.snackBar.open('Lỗi khi tạo liên kết chia sẻ!', 'Đóng', {
        duration: 3000,
      });
    }
  }

  // Check if the event is the next upcoming one
  isNextEvent(eventDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    return (
      eventDate >= today &&
      !this.formData.events.some((e) => e.date > today && e.date < eventDate)
    );
  }

  // Format lunar date for display
  formatLunarDate(lunarDate?: {
    day: number;
    month: number;
    year: number | string;
    leap: boolean;
  }): string {
    return lunarDate
      ? `${this.decimalPipe.transform(
        lunarDate.day,
        '2.0-0'
      )}/${this.decimalPipe.transform(lunarDate.month, '2.0-0')}${lunarDate.leap ? ' (Nhuận)' : ''}/${lunarDate.year
      }`
      : '';
  }

  // Generate a concise summary of the Tuần Cửu
  getTuanCuuSummary(): string {
    if (!this.formData.name || this.formData.events.length === 0) {
      return '';
    }

    // Find the selected title
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.formData.title
    );
    const eventTitle = selectedTitle?.eventTitle || 'Cầu Siêu';

    // Get title display text
    let titleText = selectedTitle?.name || '';

    // For 'chua-co-dao' or 'dao-huu', use the howToAddress field instead of the title name
    if (
      selectedTitle &&
      (selectedTitle.key === 'chua-co-dao' || selectedTitle.key === 'dao-huu')
    ) {
      titleText =
        selectedTitle.howToAddress?.[this.formData.gender] || titleText;
    }
    // For 'chuc-viec', use the subtitle name instead of the title name
    else if ((selectedTitle?.key === 'chuc-viec' || selectedTitle?.key === 'bao-quan' || selectedTitle?.key === 'thoi-quan') && this.formData.subTitle) {
      const selectedSubTitle = selectedTitle.subTitle?.find(
        (sub) => sub.key === this.formData.subTitle
      );
      if (selectedSubTitle) {
        titleText = selectedSubTitle.name;
      }
    }

    // Get the color name if applicable
    const colorName =
      this.formData.gender === 'male' && this.formData.color
        ? this.colorOptions.find((c) => c.value === this.formData.color)?.name +
        ' '
        : '';

    // Get year label safely
    const yearLabel = this.years?.find((y) => y?.value === this.formData.year)?.label || '';

    // Get solar date with validation
    let solarDateFormatted = '';
    try {
      const solarDate = this.calendarService.getConvertedFullDate({
        lunarDay: this.formData.date,
        lunarMonth: this.formData.month,
        lunarYear: typeof this.formData.year === 'number' ? this.formData.year : parseInt(this.formData.year, 10),
      }).convertLunar2Solar;

      if (solarDate && solarDate instanceof Date && !isNaN(solarDate.getTime())) {
        solarDateFormatted = this.datePipe.transform(solarDate, 'dd/MM/yyyy') || '';
      }
    } catch (error) {
      console.error('Error converting lunar to solar date:', error);
    }

    // Build the summary string
    return `${eventTitle} Cửu cho ${titleText} ${this.formData.holyName || this.formData.name
      }, ${this.formData.age || ''} tuổi, mất thời ${this.formData.time || ''} ngày ${this.formData.date
      }/${this.decimalPipe.transform(this.formData.month, '2.0-0')}/${yearLabel
      }${solarDateFormatted ? ` (${solarDateFormatted})` : ''}.`;
  }

  getHolyName() {
    const foundTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.formData.title
    );
    const selectedColor = this.colorOptions.find(
      (color) => color.value === this.formData.color
    );

    if (foundTitle && foundTitle.isHolyNameRequired) {
      this.formData.holyName = `${this.formData.gender === 'female' ? 'Hương ' : ''
        }${this.formData.gender === 'male' ? selectedColor?.name + (this.formData?.title !== 'bao-dan' ? ' ' : '') : ''}${this.formData?.title !== 'bao-dan' ? (this.formData.name?.trim()?.split(' ')[
          this.formData.name?.trim()?.split(' ')?.length - 1
        ]) : (', ' + this.formData.name)
        }${this.formData?.title !== 'bao-dan' && this.formData.gender === 'male' ? ' Thanh ' : ''}`;
    }
  }

  // Validate the form data
  validateForm(): boolean {
    // Reset all error flags
    Object.keys(this.formErrors).forEach((key) => {
      this.formErrors[key] = false;
    });

    let isValid = true;

    // Check required fields
    if (!this.formData.name || this.formData.name.trim() === '') {
      this.formErrors['name'] = true;
      isValid = false;
    }

    if (!this.formData.title) {
      this.formErrors['title'] = true;
      isValid = false;
    }

    // Make sure events are calculated
    if (this.formData.events.length === 0) {
      this.calculateEvents();
    }

    return isValid;
  }

  // Save Tuan Cuu data to IndexedDB
  async saveTuanCuu(): Promise<void> {
    // Validate the form
    if (!this.validateForm()) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc!', 'Đóng', {
        duration: 3000,
      });
      return;
    }

    try {
      // Create death date
      const deathDate = this.calendarService.getConvertedFullDate({
        lunarDay: this.formData.date,
        lunarMonth: this.formData.month,
        lunarYear: this.formData.year,
      }).convertLunar2Solar;

      // Create the Tuan Cuu object
      const tuanCuu: TuanCuu = {
        id: this.tuanCuuId || uuidv4(),
        name: this.getTuanCuuSummary(),
        startDate: this.formData.events[0].date,
        endDate: this.formData.events[this.formData.events.length - 1].date,
        events: this.formData.events,
        deceased: {
          name: this.formData.name,
          age: this.formData.age,
          gender: this.formData.gender,
          deathDate: deathDate,
          deathLunarDate: {
            day: this.formData.date,
            month: this.formData.month,
            year: this.years?.find((y) => y?.value === this.formData.year)
              ?.label,
          },
          title: this.formData.title,
          subTitle: this.formData.subTitle,
          holyName: this.formData.holyName,
          color: this.formData.color,
          deathTime: this.formData.time,
        },
        summary: this.getTuanCuuSummary(),
        status: this.tuanCuuService.calculateStatus({
          startDate: this.formData.events[0].date,
          endDate: this.formData.events[this.formData.events.length - 1].date,
        } as TuanCuu),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to IndexedDB
      if (this.isEditMode && this.tuanCuuId) {
        await this.tuanCuuService.updateTuanCuu(this.tuanCuuId, tuanCuu);
        this.snackBar.open('Đã cập nhật Tuần Cửu thành công!', 'Đóng', {
          duration: 3000,
        });
      } else {
        await this.tuanCuuService.addTuanCuu(tuanCuu);
        this.snackBar.open('Đã tạo Tuần Cửu thành công!', 'Đóng', {
          duration: 3000,
        });
      }
      if (!this.isEditMode) {
        // Navigate back to the dashboard
        this.router.navigate(['/tuan-cuu']);
      }
    } catch (error) {
      this.snackBar.open('Lỗi khi lưu dữ liệu!', 'Đóng', {
        duration: 3000,
      });
      console.error('Error saving Tuan Cuu data:', error);
    }
  }

  // Check if there are custom event times
  hasCustomEventTimes(): boolean {
    return this.formData.events.some(event => event.eventTime !== 'Dậu');
  }

  // Send all Tuan Cuu events to Google Calendar step by step
  sendAllEventsToGoogleCalendar(): void {
    if (!this.validateForm()) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc!', 'Đóng', {
        duration: 3000,
      });
      return;
    }

    if (this.formData.events.length === 0) {
      this.snackBar.open('Vui lòng tính toán các sự kiện tuần cửu trước!', 'Đóng', {
        duration: 3000,
      });
      return;
    }

    // Show confirmation dialog
    const confirmMessage = `Bạn có muốn gửi tất cả ${this.formData.events.length} sự kiện tuần cửu đến Google Calendar?\n\nCác sự kiện sẽ được mở từng cái một để bạn có thể chỉnh sửa và lưu từng sự kiện. Sau đó hãy quay lại CaoDaiON để tiếp tục bạn nhé!`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.sendEventsStepByStep(0);
  }

  private sendEventsStepByStep(currentIndex: number): void {
    if (currentIndex >= this.formData.events.length) {
      this.snackBar.open(`Hoàn thành! Đã gửi tất cả ${this.formData.events.length} sự kiện tuần cửu.`, 'Đóng', {
        duration: 5000,
      });
      return;
    }

    const event = this.formData.events[currentIndex];
    const eventData = this.createEventDataForGoogleCalendar(event, currentIndex);
    const googleCalendarUrl = this.calendarService.getGoogleCalendarEventEditUrl(eventData);
    
    // Open current event
    window.open(googleCalendarUrl, '_blank');
    
    // Show progress message
    this.snackBar.open(`Sự kiện ${currentIndex + 1}/${this.formData.events.length}: ${event.sequence}`, 'Đóng', {
      duration: 2000,
    });

    // Ask if user wants to continue to next event
    const continueMessage = `Đã mở sự kiện "${event.sequence}".\n\nBạn có muốn tiếp tục với sự kiện tiếp theo?`;
    
    setTimeout(() => {
      if (confirm(continueMessage)) {
        this.sendEventsStepByStep(currentIndex + 1);
      } else {
        this.snackBar.open(`Đã dừng tại sự kiện ${currentIndex + 1}/${this.formData.events.length}.`, 'Đóng', {
          duration: 3000,
        });
      }
    }, 1000); // Wait 1 second before asking
  }

  private createEventDataForGoogleCalendar(event: any, index: number): any {
    // Find title information for event naming
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.formData.title
    );
    const eventTitle = selectedTitle?.eventTitle || 'Cầu Siêu';

    // Get title display text
    let titleText = selectedTitle?.name || '';
    if (selectedTitle && (selectedTitle.key === 'chua-co-dao' || selectedTitle.key === 'dao-huu')) {
      titleText = selectedTitle.howToAddress?.[this.formData.gender] || titleText;
    } else if ((selectedTitle?.key === 'chuc-viec' || selectedTitle?.key === 'bao-quan' || selectedTitle?.key === 'thoi-quan') && this.formData.subTitle) {
      const selectedSubTitle = selectedTitle.subTitle?.find(
        (sub) => sub.key === this.formData.subTitle
      );
      if (selectedSubTitle) {
        titleText = selectedSubTitle.name;
      }
    }

    // Create event name template with new format: "Cầu Siêu <sequence> cho <title> <holyname>, <name> | thời <eventTime> - <lunar date>"
    const fullName = this.formData.holyName || this.formData.name;
    let displayName = fullName;
    
    // If there's a holy name, format it properly
    if (this.formData.holyName && this.formData.holyName !== this.formData.name) {
      displayName = `${this.formData.holyName}, ${this.formData.name}`;
    }
    
    const eventNameTemplate = `Cầu Siêu ${event.sequence} cho ${titleText} ${displayName} | thời ${event.eventTime} - ${this.formatLunarDate(event.lunarDate)}`;

    // Convert lunar time to solar time for Google Calendar (2-hour duration)
    const lunarToSolarTimeMap: { [key: string]: { start: string, end: string } } = {
      'Tý': { start: '23:00:00', end: '01:00:00' },
      'Sửu': { start: '01:00:00', end: '03:00:00' }, 
      'Dần': { start: '03:00:00', end: '05:00:00' },
      'Mão': { start: '05:00:00', end: '07:00:00' },
      'Thìn': { start: '07:00:00', end: '09:00:00' },
      'Tị': { start: '09:00:00', end: '11:00:00' },
      'Ngọ': { start: '11:00:00', end: '13:00:00' },
      'Mùi': { start: '13:00:00', end: '15:00:00' },
      'Thân': { start: '15:00:00', end: '17:00:00' },
      'Dậu': { start: '17:00:00', end: '19:00:00' },
      'Tuất': { start: '19:00:00', end: '21:00:00' },
      'Hợi': { start: '21:00:00', end: '23:00:00' }
    };

    const timeRange = lunarToSolarTimeMap[event.eventTime] || { start: '17:00:00', end: '19:00:00' };
    const startTime = new Date(event.date);
    const [startHours, startMinutes, startSeconds] = timeRange.start.split(':').map(Number);
    startTime.setHours(startHours, startMinutes, startSeconds);
    
    const endTime = new Date(event.date);
    const [endHours, endMinutes, endSeconds] = timeRange.end.split(':').map(Number);
    
    // Handle next day for times like Tý (23:00-01:00)
    if (endHours < startHours) {
      endTime.setDate(endTime.getDate() + 1);
    }
    endTime.setHours(endHours, endMinutes, endSeconds);

    return {
      text: eventNameTemplate,
      subTitle: `Tuần ${event.sequence} | ${this.formatLunarDate(event.lunarDate)}`,
      dates: [startTime, endTime],
      location: 'CaoDaiON',
      details: `Sự kiện ${event.sequence} trong chuỗi Tuần Cửu cho ${titleText} ${this.formData.holyName || this.formData.name}.\n\nThời gian: ${event.eventTime} (${timeRange.start} - ${timeRange.end})\nNgày âm lịch: ${this.formatLunarDate(event.lunarDate)}\nNgày dương lịch: ${this.formatDate(event.date)}\n\nTự động tạo bởi ứng dụng CaoDaiON.\n\nLưu ý: Đây là sự kiện ${index + 1}/${this.formData.events.length} trong chuỗi Tuần Cửu.`
    };
  }
}
