import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    MatDividerModule
],
  templateUrl: './add-event-bottom-sheet.component.html',
  styleUrls: ['./add-event-bottom-sheet.component.scss']
})
export class AddEventBottomSheetComponent implements OnInit {
  private lichEventService = inject(LichEventService);
  private eventService = inject(EventService);
  eventForm: FormGroup;
  selectedDate: CalendarDate;
  existingEvent?: CalendarEvent;
  isEditMode: boolean = false;
  selectedTabIndex: number = 0;
  timeOptions: string[] = [];
  thanhSoMembers = <any>[]
  selectedThanhSo: any;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddEventBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: AddEventData,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.selectedDate = data.selectedDate;
    this.existingEvent = data.existingEvent;
    this.isEditMode = !!this.existingEvent;
    this.selectedTabIndex = data?.isAddThanhSoEvent ? 1 : 0;

    // Initialize form with existing event data if editing
    const title = this.existingEvent?.title || '';
    const description = this.existingEvent?.description || '';
    const date = this.existingEvent?.solar ?
      new Date(this.existingEvent.solar.year!, this.existingEvent.solar.month! - 1, this.existingEvent.solar.day!) :
      this.selectedDate.solar.date;
    const startTime = this.existingEvent?.startTime || '09:00';
    const endTime = this.existingEvent?.endTime || '17:00';
    if (data?.isAddThanhSoEvent) {
      this.eventForm = this.fb.group({
        thanhSo: [this.selectedThanhSo, [Validators.required]],
        title: [title, [Validators.required, Validators.minLength(1)]],
        description: [description],
        date: [date],
        startTime: [startTime],
        endTime: [endTime]
      });
    } else {
      this.eventForm = this.fb.group({
        title: [title, [Validators.required, Validators.minLength(1)]],
        description: [description],
        date: [date],
        startTime: [startTime],
        endTime: [endTime]
      });
    }
    // Generate time options (00:00 to 23:30 in 30-minute intervals)
    this.generateTimeOptions();
  }

  ngOnInit(): void {
    this.loadThanhSoMembers();
  }

  loadThanhSoMembers(): void {
    this.eventService.fetchRegisteredMember().subscribe({
      next: (res) => {
        if (res?.status === 200) {
          this.thanhSoMembers = res.data?.filter((item: any) => item?.thanhSoSheet);
          console.log(this.thanhSoMembers);
          
        }
      },
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

  onSave(): void {
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
}
