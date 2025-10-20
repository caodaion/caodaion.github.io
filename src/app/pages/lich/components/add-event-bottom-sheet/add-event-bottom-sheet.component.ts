import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CalendarDate, CalendarEvent } from '../../services/lich.service';
import { LichEventService } from '../../services/event.service';
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { EventService } from 'src/app/shared/services/event/event.service';
import { MatDividerModule } from "@angular/material/divider";
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { time } from 'console';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { SharedModule } from "../../../../shared/shared.module";
import { CommonService } from 'src/app/shared/services/common/common.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

export interface AddEventData {
  selectedDate: CalendarDate;
  existingEvent?: CalendarEvent;
  isAddThanhSoEvent?: boolean;
}

@Component({
  selector: 'app-add-event-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    SharedModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './add-event-bottom-sheet.component.html',
  styleUrls: ['./add-event-bottom-sheet.component.scss']
})
export class AddEventBottomSheetComponent implements OnInit {
  private lichEventService = inject(LichEventService);
  private eventService = inject(EventService);
  private decimalPipe = inject(DecimalPipe);
  private commonService = inject(CommonService);
  private matDialog = inject(MatDialog);
  eventForm!: FormGroup;
  selectedDate: CalendarDate;
  existingEvent?: CalendarEvent;
  isEditMode: boolean = false;
  selectedTabIndex: number = 0;
  timeOptions: string[] = [];
  thanhSoMembers = <any>[]
  selectedThanhSo: any;
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: any[] = [];
  caodaiTitles = CAODAI_TITLE.data;
  subTitles: any[] = [];
  colorOptions = [
    { value: 'yellow', name: 'Thái' },
    { value: 'blue', name: 'Thượng' },
    { value: 'red', name: 'Ngọc' },
  ];
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
  solarTimeOptions = Array.from({ length: 24 }, (_, i) => i);

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddEventBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: AddEventData,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private calendarService: CalendarService
  ) {
    this.selectedDate = data.selectedDate;
    this.existingEvent = data.existingEvent;
    this.isEditMode = !!this.existingEvent;
    this.selectedTabIndex = data?.isAddThanhSoEvent ? 1 : 0;
    // Generate time options (00:00 to 23:30 in 30-minute intervals)
    this.generateTimeOptions();
    this.onChangeSelectedTabIndex(this.selectedTabIndex);
  }

  ngOnInit(): void {
    this.years = Array.from({ length: 100 }, (_, i) => {
      const iDate = new Date(new Date().setFullYear(new Date().getFullYear() - 50 + i));
      return {
        value: iDate.getFullYear(),
        label:
          this.calendarService.getConvertedFullDate(iDate).convertSolar2Lunar
            ?.lunarYearName,
      };
    });
  }

  loadThanhSoMembers(): void {
    this.eventService.fetchRegisteredMember().subscribe({
      next: (res) => {
        if (res?.status === 200) {
          this.thanhSoMembers = res.data?.filter((item: any) => item?.thanhSoSheet);
        }
      },
    });
  }

  getThanhSoEvents(): void {
    this.eventService.fetchThanhSoEvent(this.eventForm.value?.thanhSo).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          this.selectedThanhSo = res;
          const selectedThanhSoData = this.thanhSoMembers.find((item: any) => item?.thanhSoSheet === this.eventForm.value?.thanhSo);
          this.selectedThanhSo.setting = {
            ...this.selectedThanhSo.setting,
            ...selectedThanhSoData
          }
        }
      },
      error: (err) => {
        console.error('Error fetching events for Thanh So:', err);
      }
    });
  }

  private generateTimeOptions(): void {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    this.timeOptions = options;
  }

  get formattedDate(): string {
    return this.datePipe.transform(this.selectedDate.solar.date, 'dd/MM/yyyy') || '';
  }

  userName: any = '';

  duplicateFound: any;
  dialogRef: any;
  errorMessage: any;
  @ViewChild('enterUserName') enterUserName: any;
  @ViewChild('formIframe') formIframe: any;
  onSave(isGenerate: boolean = false): void {
    if (this.selectedTabIndex === 1) {
      if (this.eventForm.valid) {
        if (!isGenerate) {
          this.dialogRef = this.matDialog.open(this.enterUserName);
          return;
        }
        if (this.userName !== this.selectedThanhSo?.setting?.userName) {
          this.errorMessage = `Tên người dùng cập nhật sự kiện cho Thánh Sở ${this.selectedThanhSo?.setting?.thanhSo} không khớp`;
          return;
        }
        this.dialogRef?.close();
        const formData = this.eventForm.value;
        if (this.selectedThanhSo?.setting?.googleFormsId) {
          const foundData = this.selectedThanhSo?.data?.find((item: any) => item?.key == this.eventKey)
          this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.selectedThanhSo?.setting?.googleFormsId}/viewform`
          this.googleFormsPath += `?${this.selectedThanhSo?.setting?.key}=${encodeURIComponent(this.eventKey)}`
          this.googleFormsPath += `&${this.selectedThanhSo?.setting?.eventName}=${encodeURIComponent(formData?.eventTitle)}`
          this.googleFormsPath += `&${this.selectedThanhSo?.setting?.eventType}=${encodeURIComponent(this.eventType)}`
          this.googleFormsPath += `&${this.selectedThanhSo?.setting?.data}=${encodeURIComponent(JSON.stringify({
            eventDate: formData?.date,
            eventTime: formData?.eventTime,
            eventMonth: formData?.month,
            sex: formData?.gender,
            age: formData?.age,
            title: formData?.title,
            subTitle: formData?.subTitle,
            color: formData?.color,
            name: formData?.name,
            holyName: formData?.holyName
          }))}`
          setTimeout(() => {
            // Scroll mat-bottom-sheet-container to preview image
            const dialogContent = document.querySelector('mat-bottom-sheet-container');
            const imgEl = this.formIframe?.nativeElement;
            if (dialogContent && imgEl) {
              const imgRect = imgEl.getBoundingClientRect();
              const dialogRect = dialogContent.getBoundingClientRect();
              dialogContent.scrollTop += (imgRect.top - dialogRect.top) - 24;
            }
          }, 100);
        }
        return;
      }
    }

    if (this.eventForm.valid) {
      const formData = this.eventForm.value;

      // Combine date and time
      const eventDate = new Date(formData.date);
      const [startHour, startMinute] = formData.startTime.split(':');
      const [endHour, endMinute] = formData.endTime.split(':');

      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const eventData = {
        title: formData.title,
        description: formData.description || '',
        date: startDateTime,
        startTime: formData.startTime,
        endTime: formData.endTime,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (this.isEditMode && this.existingEvent?.id) {
        // Update existing event
        this.lichEventService.updateEvent(parseInt(this.existingEvent.id), eventData).then(() => {
          this.bottomSheetRef.dismiss({ action: 'updated', event: eventData });
        }).catch(error => {
          console.error('Lỗi khi cập nhật sự kiện:', error);
        });
      } else {
        // Create new event
        this.lichEventService.addEvent(eventData).then(() => {
          this.bottomSheetRef.dismiss({ action: 'created', event: eventData });
        }).catch(error => {
          console.error('Lỗi khi tạo sự kiện:', error);
        });
      }
    }
  }

  onCancel(): void {
    this.bottomSheetRef.dismiss();
  }

  onDelete(): void {
    if (this.isEditMode && this.existingEvent?.id) {
      // Confirm deletion
      if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
        this.lichEventService.deleteEvent(parseInt(this.existingEvent.id)).then(() => {
          this.bottomSheetRef.dismiss({ action: 'deleted', event: this.existingEvent });
        }).catch(error => {
          console.error('Lỗi khi xóa sự kiện:', error);
          alert('Không thể xóa sự kiện. Vui lòng thử lại.');
        });
      }
    }
  }

  onChangeSelectedTabIndex(index: number): void {
    this.selectedTabIndex = Number(index);
    if (this.selectedTabIndex === 1) {
      this.loadThanhSoMembers();
    }
    this.initForm();
  }

  googleFormsPath: any;
  initForm(): void {
    // Initialize form with existing event data if editing
    const title = this.existingEvent?.title || '';
    const description = this.existingEvent?.description || '';
    const date = this.existingEvent?.solar ?
      new Date(this.existingEvent.solar.year!, this.existingEvent.solar.month! - 1, this.existingEvent.solar.day!) :
      this.selectedDate.solar.date;
    const startTime = this.existingEvent?.startTime || '09:00';
    const endTime = this.existingEvent?.endTime || '17:00';
    const convertedLunar = this.calendarService.getConvertedFullDate(new Date(date)).convertSolar2Lunar;
    if (this.selectedTabIndex === 1) {
      this.eventForm = this.fb.group({
        thanhSo: [this.selectedThanhSo, [Validators.required]],
        eventTitle: [title, [Validators.required, Validators.minLength(1)]],
        title: ['', [Validators.required, Validators.minLength(1)]],
        holyName: [''],
        gender: [''],
        name: [''],
        subTitle: [''],
        color: [''],
        date: [convertedLunar.lunarDay],
        month: [convertedLunar.lunarMonth],
        eventTime: [''],
        age: ['']
      });
    } else {
      this.eventForm = this.fb.group({
        eventTitle: [title, [Validators.required, Validators.minLength(1)]],
        description: [description],
        date: [date],
        startTime: [startTime],
        endTime: [endTime]
      });
    }
    this.subscribeToFormChanges()

  }

  eventFormSubscription: any;
  subscribeToFormChanges(): void {
    if (this.eventFormSubscription) {
      this.eventFormSubscription.unsubscribe();
    }
    this.eventFormSubscription = this.eventForm.valueChanges.subscribe(value => {
      this.getSummary();
    });
  }

  getHolyName() {
    const foundTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.eventForm.get('title')?.value
    );
    const selectedColor = this.colorOptions.find(
      (color) => color.value === this.eventForm.get('color')?.value
    );

    if (foundTitle && foundTitle.isHolyNameRequired) {
      this.eventForm.controls['holyName'].setValue(`${this.eventForm.get('gender')?.value === 'female' ? 'Hương ' : ''
        }${this.eventForm.get('gender')?.value === 'male' ? selectedColor?.name + (this.eventForm.get('title')?.value !== 'bao-dan' ? ' ' : '') : ''}${this.eventForm.get('title')?.value !== 'bao-dan' ? (this.eventForm?.get('name')?.value?.trim()?.split(' ')[
          this.eventForm?.get('name')?.value?.trim()?.split(' ')?.length - 1
        ]) : (', ' + this.eventForm?.get('name')?.value)
        }${this.eventForm?.get('title')?.value !== 'bao-dan' && this.eventForm.get('gender')?.value === 'male' ? ' Thanh ' : ''}`);
    }
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
      this.eventForm.controls['holyName'].setValue('');
      this.eventForm.controls['color'].setValue('');
    }
  }

  // Check if holy name is required
  isHolyNameRequired(): boolean {
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.eventForm.get('title')?.value
    );
    return selectedTitle ? !!selectedTitle.isHolyNameRequired : false;
  }

  // Check if color selection should be shown (for male with holy name required)
  shouldShowColorSelection(): boolean {
    return this.eventForm.get('gender')?.value === 'male' && this.isHolyNameRequired();
  }

  eventType: any;
  eventKey: any;
  // Generate a concise summary of the Tuần Cửu
  getSummary() {
    // Find the selected title
    const selectedTitle = this.caodaiTitles.find(
      (title: any) => title.key === this.eventForm.get('title')?.value
    );
    const eventTitle = selectedTitle?.eventTitle || 'Cầu Siêu';

    // Get title display text
    let titleText = selectedTitle?.name || '';

    // For 'chua-co-dao' or 'dao-huu', use the howToAddress field instead of the title name
    if (
      selectedTitle &&
      (selectedTitle.key === 'chua-co-dao' || selectedTitle.key === 'dao-huu')
    ) {
      const genderValue = this.eventForm.get('gender')?.value as 'male' | 'female';
      titleText =
        selectedTitle.howToAddress?.[genderValue] || titleText;
    }
    // For 'chuc-viec', use the subtitle name instead of the title name
    else if ((selectedTitle?.key === 'chuc-viec' || selectedTitle?.key === 'bao-quan' || selectedTitle?.key === 'thoi-quan') && this.eventForm.get('subTitle')?.value) {
      const selectedSubTitle = selectedTitle.subTitle?.find(
        (sub) => sub.key === this.eventForm.get('subTitle')?.value
      );
      if (selectedSubTitle) {
        titleText = selectedSubTitle.name;
      }
    }


    // Get solar date with validation
    let solarDateFormatted = '';
    try {
      const solarDate = this.calendarService.getConvertedFullDate({
        lunarDay: this.eventForm.get('date')?.value,
        lunarMonth: this.eventForm.get('month')?.value,
        lunarYear: typeof this.eventForm.get('year')?.value === 'number' ? this.eventForm.get('year')?.value : parseInt(this.eventForm.get('year')?.value, 10),
      }).convertLunar2Solar;

      if (solarDate && solarDate instanceof Date && !isNaN(solarDate.getTime())) {
        solarDateFormatted = this.datePipe.transform(solarDate, 'dd/MM/yyyy') || '';
      }
    } catch (error) {
      console.error('Error converting lunar to solar date:', error);
    }

    // Log all invalid fields
    if (this.eventForm.invalid) {
      const invalidFields = Object.keys(this.eventForm.controls).filter(key => this.eventForm.get(key)?.invalid);
    }

    let keyData = `${this.eventForm.get('eventTitle')?.value}`
    this.eventType = `${this.commonService.generatedSlug(eventTitle)}-ky-niem`
    this.eventKey = this.commonService.generatedSlug(keyData)
    this.eventForm.controls['eventTitle'].setValue(
      `${eventTitle} kỷ niệm cho${titleText ? ' ' + titleText : ''} ${this.eventForm.get('holyName')?.value || this.eventForm.get('name')?.value
      }`,
      { emitEvent: false }
    );
    this.eventForm.controls['eventTitle'].updateValueAndValidity({ emitEvent: false });
  }
}
