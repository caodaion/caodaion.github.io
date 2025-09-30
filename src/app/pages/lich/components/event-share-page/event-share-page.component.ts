import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { EventService } from '../../services/event.service';
import { ChildHeaderComponent } from 'src/app/components/child-header/child-header.component';
import { IconComponent } from "src/app/components/icon/icon.component";

interface EventData {
  type: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  solar?: {
    year: number;
    month: number;
    day: number;
  };
  lunar?: {
    year: number;
    month: number;
    day: number;
    isLeapMonth?: boolean;
  };
  timestamp: string;
}

@Component({
  selector: 'app-event-share-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    ChildHeaderComponent,
    IconComponent
],
  templateUrl: './event-share-page.component.html',
  styleUrls: ['./event-share-page.component.scss']
})
export class EventSharePageComponent implements OnInit {
  eventData: EventData | null = null;
  isLoading = true;
  error: string | null = null;
  shareUrl = '';
  isAddingToCalendar = false;
  addToCalendarSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          // Decode URI component data
          const decodedData = decodeURIComponent(params['data']);
          this.eventData = JSON.parse(decodedData);
          this.shareUrl = window.location.href;
          this.isLoading = false;
        } catch (error) {
          console.error('Error parsing event data:', error);
          this.error = 'Không thể tải dữ liệu sự kiện';
          this.isLoading = false;
        }
      } else {
        this.error = 'Không tìm thấy dữ liệu sự kiện';
        this.isLoading = false;
      }
    });
  }

  get formattedDate(): string {
    if (!this.eventData?.date) return '';
    const date = new Date(this.eventData.date);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get formattedTime(): string {
    if (!this.eventData?.startTime || !this.eventData?.endTime) return '';
    return `${this.eventData.startTime} - ${this.eventData.endTime}`;
  }

  get lunarDate(): string {
    if (!this.eventData?.lunar) return '';
    const { year, month, day, isLeapMonth } = this.eventData.lunar;
    const leapText = isLeapMonth ? ' (nhuận)' : '';
    return `Âm lịch: ${day}/${month}/${year}${leapText}`;
  }

  addToGoogleCalendar(): void {
    if (!this.eventData) return;

    // Create event data for Google Calendar
    const eventData = {
      text: this.eventData.title,
      subTitle: this.eventData.description || '',
      dates: this.getEventDates(),
      location: 'CaoDaiON',
      details: this.eventData.description || ''
    };

    // Generate Google Calendar URL
    const googleCalendarUrl = this.calendarService.getGoogleCalendarEventEditUrl(eventData);
    
    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
  }

  private getEventDates(): string[] {
    if (!this.eventData?.date) return ['09:00:00', '17:00:00'];
    
    const eventDate = new Date(this.eventData.date);
    const startTime = this.eventData.startTime ? `${this.eventData.startTime}:00` : '09:00:00';
    const endTime = this.eventData.endTime ? `${this.eventData.endTime}:00` : '17:00:00';
    
    return [startTime, endTime];
  }

  goBack(): void {
    this.router.navigate(['/lich']);
  }

  shareEvent(): void {
    if (navigator.share && this.eventData) {
      navigator.share({
        title: this.eventData.title,
        text: this.eventData.description || '',
        url: this.shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(this.shareUrl).then(() => {
        alert('Đã sao chép link vào clipboard!');
      });
    }
  }

  addToMyCalendar(): void {
    if (!this.eventData) return;

    this.isAddingToCalendar = true;

    // Convert event data to CalendarEventData format
    const eventDate = new Date(this.eventData.date);
    
    const eventDataForDB = {
      title: this.eventData.title,
      description: this.eventData.description || '',
      date: eventDate,
      startTime: this.eventData.startTime || '09:00',
      endTime: this.eventData.endTime || '17:00',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if event already exists (by title and date)
    this.eventService.getEventsByDate(eventDate).then(existingEvents => {
      const duplicateEvent = existingEvents.find(event => 
        event.title === this.eventData!.title && 
        event.date.toDateString() === eventDate.toDateString()
      );

      if (duplicateEvent) {
        // Update existing event
        this.eventService.updateEvent(duplicateEvent.id!, eventDataForDB).then(() => {
          this.isAddingToCalendar = false;
          this.addToCalendarSuccess = true;
          setTimeout(() => {
            this.addToCalendarSuccess = false;
          }, 3000);
        }).catch(error => {
          console.error('Error updating event:', error);
          this.isAddingToCalendar = false;
          alert('Không thể cập nhật sự kiện. Vui lòng thử lại.');
        });
      } else {
        // Add new event
        this.eventService.addEvent(eventDataForDB).then(() => {
          this.isAddingToCalendar = false;
          this.addToCalendarSuccess = true;
          setTimeout(() => {
            this.addToCalendarSuccess = false;
          }, 3000);
        }).catch(error => {
          console.error('Error adding event:', error);
          this.isAddingToCalendar = false;
          alert('Không thể thêm sự kiện. Vui lòng thử lại.');
        });
      }
    }).catch(error => {
      console.error('Error checking existing events:', error);
      this.isAddingToCalendar = false;
      alert('Không thể kiểm tra sự kiện hiện có. Vui lòng thử lại.');
    });
  }
}
