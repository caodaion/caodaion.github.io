import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CalendarEvent } from '../../services/lich.service';
import html2canvas from 'html2canvas-pro';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { IconComponent } from "src/app/components/icon/icon.component";
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AddEventBottomSheetComponent } from '../add-event-bottom-sheet/add-event-bottom-sheet.component';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';

@Component({
  selector: 'app-event-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    IconComponent,
    MatBottomSheetModule
],
  templateUrl: './event-image-dialog.component.html',
  styleUrls: ['./event-image-dialog.component.scss']
})
export class EventImageDialogComponent implements OnInit {
  @ViewChild('eventCard') eventCard!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;

  event: CalendarEvent;
  dateData: any;
  imagePreviewUrl: string | null = null;
  isGenerating = false;

  constructor(
    public dialogRef: MatDialogRef<EventImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      event: CalendarEvent,
      dateData: any,
    },
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private calendarService: CalendarService
  ) {
    this.event = data.event;
    this.dateData = data.dateData
    console.log(this.event);
    console.log(this.dateData);
  }

  ngOnInit(): void {
    // Generate the image on initialization
    setTimeout(() => {
      // this.generateImage();
    }, 500);
  }

  async generateImage(isDownload: boolean = false): Promise<void> {
    if (!this.eventCard) return;

    this.isGenerating = true;

    try {
      const canvas = await html2canvas(this.eventCard.nativeElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });

      this.imagePreviewUrl = canvas.toDataURL('image/png');
      if (!isDownload) {
        this.isGenerating = false;
        return;
      }
      const link = document.createElement('a');
      const filename = `event-${this.event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().getTime()}.png`;

      link.href = this.imagePreviewUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Wait for the image to load
      setTimeout(() => {
        this.isGenerating = false;
      }, 300);
    } catch (error) {
      console.error('Error generating image:', error);
      this.isGenerating = false;
    }
  }

  onContentEdit(field: string, event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const content = target.innerText.trim();

    if (field === 'title') {
      this.event.title = content;
    } else if (field === 'description') {
      this.event.description = content;
    }

    // Regenerate the image with the updated content
    setTimeout(() => {
      // this.generateImage();
    }, 100);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openTuanCuu() {
    this.closeDialog()
    this.router.navigate([`/tuan-cuu/${this.event.tuanCuuId}`]);
  }

  openEditPersonalEvent(): void {
    // Close current dialog first
    this.dialogRef.close();
    
    // Open add event bottom sheet with existing event data
    const bottomSheetRef = this.bottomSheet.open(AddEventBottomSheetComponent, {
      data: { 
        selectedDate: this.dateData,
        existingEvent: this.event
      }
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        console.log('Add event bottom sheet result:', result);
        // The calendar will automatically refresh when the dialog closes
      }
    });
  }

  addToGoogleCalendar(): void {
    // Create event data for Google Calendar
    const eventData = {
      text: this.event.title,
      subTitle: this.event.description || '',
      dates: this.getEventDates(),
      location: 'CaoDaiON',
      details: this.event.description || ''
    };
    console.log(eventData);
    

    // Generate Google Calendar URL
    const googleCalendarUrl = this.calendarService.getGoogleCalendarEventEditUrl(eventData);
    
    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
  }

  private getEventDates(): string[] {
    let eventDate: Date;
    
    if (this.event.solar) {
      // For solar events, create a full day event
      eventDate = new Date(this.event.solar.year!, this.event.solar.month! - 1, this.event.solar.day!);
    } else if (this.event.dateString) {
      // For events with dateString
      eventDate = new Date(this.event.dateString);
    } else {
      // Default to today
      eventDate = new Date();
    }

    // Use actual start and end times from the event, or defaults
    const startTime = this.event.startTime ? `${this.event.startTime}:00` : '09:00:00';
    const endTime = this.event.endTime ? `${this.event.endTime}:00` : '17:00:00';
    
    return [startTime, endTime];
  }
}