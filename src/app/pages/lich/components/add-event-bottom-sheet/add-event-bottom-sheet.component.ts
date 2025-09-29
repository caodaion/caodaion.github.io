import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { CalendarDate, CalendarEvent } from '../../services/lich.service';
import { EventService } from '../../services/event.service';

export interface AddEventData {
  selectedDate: CalendarDate;
  existingEvent?: CalendarEvent;
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
    MatSelectModule
  ],
  templateUrl: './add-event-bottom-sheet.component.html',
  styleUrls: ['./add-event-bottom-sheet.component.scss']
})
export class AddEventBottomSheetComponent implements OnInit {
  eventForm: FormGroup;
  selectedDate: CalendarDate;
  existingEvent?: CalendarEvent;
  isEditMode: boolean = false;
  private eventService = inject(EventService);

  // Time options for select dropdowns
  timeOptions: string[] = [];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddEventBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: AddEventData,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.selectedDate = data.selectedDate;
    this.existingEvent = data.existingEvent;
    this.isEditMode = !!this.existingEvent;

    // Initialize form with existing event data if editing
    const title = this.existingEvent?.title || '';
    const description = this.existingEvent?.description || '';
    const date = this.existingEvent?.solar ? 
      new Date(this.existingEvent.solar.year!, this.existingEvent.solar.month! - 1, this.existingEvent.solar.day!) : 
      this.selectedDate.solar.date;
    const startTime = this.existingEvent?.startTime || '09:00';
    const endTime = this.existingEvent?.endTime || '17:00';

      this.eventForm = this.fb.group({
        title: [title, [Validators.required, Validators.minLength(1)]],
        description: [description],
        date: [date],
        startTime: [startTime],
        endTime: [endTime]
      });

      // Generate time options (00:00 to 23:30 in 30-minute intervals)
      this.generateTimeOptions();
    }

  ngOnInit(): void {
    // Form đã được khởi tạo trong constructor
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
        this.eventService.updateEvent(parseInt(this.existingEvent.id), eventData).then(() => {
          this.bottomSheetRef.dismiss({ action: 'updated', event: eventData });
        }).catch(error => {
          console.error('Lỗi khi cập nhật sự kiện:', error);
        });
      } else {
        // Create new event
        this.eventService.addEvent(eventData).then(() => {
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
}
