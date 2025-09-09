import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/services/event/event.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LichService } from '../../services/lich.service';

@Component({
  selector: 'app-calendar-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.scss']
})
export class CalendarFilterComponent implements OnInit {
  @Output() canChiVisibilityChange = new EventEmitter<boolean>();

  eventTypes: { [key: string]: boolean } = {
    'annual-solar': true,
    'annual-lunar': true,
    'monthly-solar': true,
    'monthly-lunar': true,
    'daily': true,
    // 'user': true,
    'tuan-cuu': true
  };

  showCanChi: boolean = false;

  thanhSoMembers: any[] = [];
  selectedThanhSoIds: Set<string> = new Set();
  loadingThanhSoMembers = false;

  constructor(private lichService: LichService, private eventService: EventService) { }

  ngOnInit(): void {
    // Initialize showCanChi from localStorage if available
    const savedCanChiSetting = localStorage.getItem('showCanChi');
    if (savedCanChiSetting) {
      this.showCanChi = JSON.parse(savedCanChiSetting);
    }
    // Initialize event type filters if saved
    const savedEventTypes = localStorage.getItem('eventTypeVisibility');
    if (savedEventTypes) {
      this.eventTypes = JSON.parse(savedEventTypes);
    }
    // Restore selected thanhSo members from localStorage
    const savedThanhSo = localStorage.getItem('registeredThanhSo');
    if (savedThanhSo) {
      try {
        const arr = JSON.parse(savedThanhSo);
        if (Array.isArray(arr)) {
          this.selectedThanhSoIds = new Set(arr);
          this.fetchEventsFromThanhSo()
        }
      } catch { }
    }
    // Fetch Thánh Sở members
    this.loadingThanhSoMembers = true;
    this.eventService.fetchRegisteredMember().subscribe({
      next: (res) => {
        if (res?.status === 200) {
          this.thanhSoMembers = res.data?.filter((item: any) => item?.thanhSoSheet);
        }
        this.loadingThanhSoMembers = false;
      },
      error: () => { this.loadingThanhSoMembers = false; }
    });
  }
  /**
   * Handle Thánh Sở member selection
   */
  onThanhSoMemberChange(member: any, checked: boolean) {
    const memberId = member.thanhSoSheet;
    if (checked) {
      this.selectedThanhSoIds.add(memberId);
    } else {
      this.selectedThanhSoIds.delete(memberId);
    }
    this.fetchEventsFromThanhSo()
  }

  fetchEventsFromThanhSo() {
    // Store selected IDs in localStorage
    localStorage.setItem('registeredThanhSo', JSON.stringify(Array.from(this.selectedThanhSoIds)));
    // Remove all previous thanhso events
    this.lichService.events = this.lichService.events.filter(e => e.type !== 'thanhso');
    // Fetch and add events for all selected members
    if (this.selectedThanhSoIds.size > 0) {
      Array.from(this.selectedThanhSoIds).forEach((id) => {
        this.eventService.fetchThanhSoEvent(id).subscribe((res) => {
          if (res?.status === 200) {
            let thanhSoEvents = res?.data?.map((item: any, idx: number) => {
              return {
                id: 'thanhso-' + (item.key) + '-' + id,
                title: item.eventName,
                description: item.eventName || '',
                type: 'thanhso',
                color: '#fbbc05',
                ...item
              }
            });
            thanhSoEvents?.forEach((item: any) => {
              item.data = JSON.parse(item.data)
              item.eventTime = item.data?.eventTime
            })
            this.lichService.events.push(...thanhSoEvents);
            this.lichService['updateEvents']?.();
          }
        });
      });
    } else {
      this.lichService['updateEvents']?.();
    }
  }

  /**
   * Toggle event type visibility
   */
  toggleEventType(type: string, isVisible: boolean): void {
    // Update local state
    this.eventTypes[type] = isVisible;

    // Update the service state - this will handle the localStorage save
    this.lichService.setEventTypeVisible(type, isVisible);

    // We don't need to save to localStorage here as the service does that now
  }

  /**
   * Handle Can Chi visibility change
   */
  onCanChiChange(): void {
    // Save to localStorage
    localStorage.setItem('showCanChi', JSON.stringify(this.showCanChi));

    // Emit the event for parent components
    this.canChiVisibilityChange.emit(this.showCanChi);

    // Dispatch custom event for global communication
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('canChiVisibilityChange', {
        detail: this.showCanChi,
        bubbles: true
      });
      window.dispatchEvent(event);
      console.log('Emitted Can Chi visibility change:', this.showCanChi);
    }
  }
}