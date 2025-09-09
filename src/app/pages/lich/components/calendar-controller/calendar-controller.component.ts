import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-calendar-controller',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './calendar-controller.component.html',
  styleUrls: ['./calendar-controller.component.scss']
})
export class CalendarControllerComponent implements OnInit, OnChanges {
  @Input() date: Date = new Date();
  @Input() view: string = 'month';
  
  @Output() dateChange = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<string>();
  
  displayText: string = '';
  
  constructor() {}
  
  ngOnInit(): void {
    this.updateDisplayText();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] || changes['view']) {
      this.updateDisplayText();
    }
  }
  
  /**
   * Update the display text based on the current view and date
   */
  updateDisplayText(): void {
    if (this.view === 'month') {
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      const month = this.date.getMonth();
      const year = this.date.getFullYear();
      this.displayText = `${monthNames[month]} ${year}`;
    } 
    else if (this.view === 'week') {
      const startOfWeek = this.getStartOfWeek(this.date);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        this.displayText = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} Tháng ${endOfWeek.getMonth() + 1}, ${endOfWeek.getFullYear()}`;
      } 
      else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        this.displayText = `${startOfWeek.getDate()} Tháng ${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()} Tháng ${endOfWeek.getMonth() + 1}, ${endOfWeek.getFullYear()}`;
      } 
      else {
        this.displayText = `${startOfWeek.getDate()} Th${startOfWeek.getMonth() + 1}/${startOfWeek.getFullYear()} - ${endOfWeek.getDate()} Th${endOfWeek.getMonth() + 1}/${endOfWeek.getFullYear()}`;
      }
    } 
    else if (this.view === 'day') {
      const weekdayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const day = this.date.getDate();
      const month = this.date.getMonth() + 1;
      const year = this.date.getFullYear();
      const weekday = this.date.getDay();
      this.displayText = `${weekdayNames[weekday]}, ${day} Tháng ${month}, ${year}`;
    }
  }
  
  /**
   * Get the start of the week for a given date
   */
  getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    
    // Adjust to Monday as the first day of the week
    if (day === 0) {
      result.setDate(result.getDate() - 6); // If Sunday, go back 6 days to previous Monday
    } else {
      result.setDate(result.getDate() - (day - 1)); // Otherwise go back to Monday
    }
    
    return result;
  }
  
  /**
   * Navigate to today's date
   */
  goToToday(): void {
    this.date = new Date();
    this.dateChange.emit(this.date);
    this.updateDisplayText();
  }
  
  /**
   * Navigate to previous period based on view
   */
  goToPrevious(): void {
    const newDate = new Date(this.date);
    
    if (this.view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } 
    else if (this.view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } 
    else if (this.view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    this.date = newDate;
    this.dateChange.emit(this.date);
    this.updateDisplayText();
  }
  
  /**
   * Navigate to next period based on view
   */
  goToNext(): void {
    const newDate = new Date(this.date);
    
    if (this.view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } 
    else if (this.view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } 
    else if (this.view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    this.date = newDate;
    this.dateChange.emit(this.date);
    this.updateDisplayText();
  }
  
  /**
   * Handle view change from select
   */
  onViewChange(newView: string): void {
    this.view = newView;
    this.updateDisplayText();
    this.viewChange.emit(newView);
  }
}