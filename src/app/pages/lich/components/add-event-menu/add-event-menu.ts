import { Component, inject, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuModule } from "@angular/material/menu";
import { Router } from '@angular/router';
import { IconComponent } from "src/app/components/icon/icon.component";
import { AddEventBottomSheetComponent } from '../add-event-bottom-sheet/add-event-bottom-sheet.component';
import { DatePipe } from '@angular/common';

// Define allowed feature types
export type FeatureType = 'view-day' | 'add-event' | 'add-tuan-cuu';

// Define the list of valid features
export const VALID_FEATURES: FeatureType[] = [
  'view-day',
  'add-event',
  'add-tuan-cuu'
] as const;

@Component({
  selector: 'app-add-event-menu',
  imports: [MatMenuModule, IconComponent],
  templateUrl: './add-event-menu.html',
  styleUrl: './add-event-menu.scss'
})
export class AddEventMenu {

  protected router = inject(Router);
  protected bottomSheet = inject(MatBottomSheet);
  protected datePipe = inject(DatePipe);

  @Input() calendarDate: any;
  @Input() class: string = '';
  @Input() features: FeatureType[] = [
    'view-day',
    'add-event',
    'add-tuan-cuu'
  ];


  /**
   * Handle click on the day cell
   */
  onDayClick(): void {
    const year = this.calendarDate.solar.year;
    const month = this.calendarDate.solar.month;
    const day = this.calendarDate.solar.day;

    // Navigate to the day view with the selected date
    this.router.navigate(['/lich/d', year, month, day]);
  }

  onAddPersonalEventClick(): void {
    const bottomSheetRef = this.bottomSheet.open(AddEventBottomSheetComponent, {
      data: { selectedDate: this.calendarDate }
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        console.log('Sự kiện đã được thêm:', result);
        // Có thể thêm logic để refresh calendar hoặc hiển thị thông báo thành công
        // this.refreshEventsForDate();
      }
    });
  }

  onAddTuanCuu(): void {
    this.router.navigate([`/tuan-cuu/tinh/${this.datePipe.transform(this.calendarDate.solar.date, 'yyyy-MM-dd')}`]);
  }
  
  onAddEventClick() {
    const bottomSheetRef = this.bottomSheet.open(AddEventBottomSheetComponent, {
      data: {
        selectedDate: this.calendarDate,
        isAddThanhSoEvent: true
      },
      panelClass: 'add-event-bottom-sheet-container'
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        console.log('Sự kiện đã được thêm:', result);
        // Có thể thêm logic để refresh calendar hoặc hiển thị thông báo thành công
        // this.refreshEventsForDate();
      }
    });
  }
}
