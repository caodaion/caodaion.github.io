import { Component, Output, EventEmitter, OnInit } from '@angular/core';
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
    'user': true,
    'tuan-cuu': true
  };
  
  showCanChi: boolean = false;
  
  constructor(private lichService: LichService) {}
  
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