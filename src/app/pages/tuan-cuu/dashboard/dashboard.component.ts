import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
// import { ChildHeaderComponent } from '../../../components/child-header/child-header.component';
import { TuanCuu, TuanCuuService, TuanCuuEvent } from '../services/tuan-cuu.service';
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";
// import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    ChildHeaderComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe, TuanCuuService]
})
export class DashboardComponent implements OnInit {
  // List of all Tuan Cuu entries
  tuanCuuList: TuanCuu[] = [];
  
  // Filtered lists
  activeTuanCuuList: TuanCuu[] = [];
  upcomingTuanCuuList: TuanCuu[] = [];
  completedTuanCuuList: TuanCuu[] = [];
  
  // Status flags
  hasActiveTuanCuu = false;
  hasUpcomingTuanCuu = false;
  hasCompletedTuanCuu = false;
  
  // Loading state
  isLoading = true;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private tuanCuuService: TuanCuuService,
    private snackBar: MatSnackBar,
    // private seoService: SeoService
  ) {}

  ngOnInit(): void {
    // Set SEO metadata
    this.setSeoMetadata();
    // Load data and update statuses
    this.loadTuanCuuData();
  }

  /**
   * Set SEO metadata for the Tuan Cuu dashboard
   */
  private setSeoMetadata(): void {
    // this.seoService.updateMetadata({
    //   title: 'Tuần Cửu',
    //   description: 'Công cụ tính Tuần Cửu, cúng thất để thực hiện nghi lễ cầu siêu cho người quá cố theo truyền thống Cao Đài',
    //   url: 'tuan-cuu',
    //   keywords: 'tuần cửu, cúng thất, cầu siêu, nghi lễ, Cao Đài, cửu huyền, thất tổ',
    //   type: 'website'
    // });
  }

  // Load Tuan Cuu data from IndexedDB
  async loadTuanCuuData(): Promise<void> {
    try {
      this.isLoading = true;
      
      // First update all statuses to ensure they're current
      await this.tuanCuuService.updateAllStatuses();
      
      // Then load the updated data
      this.tuanCuuList = await this.tuanCuuService.getTuanCuuList();
      this.filterTuanCuuByStatus();
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.snackBar.open('Lỗi khi tải dữ liệu!', 'Đóng', {
        duration: 3000
      });
      console.error('Error loading data:', error);
    }
  }

  // Filter Tuan Cuu list by status
  filterTuanCuuByStatus(): void {
    this.activeTuanCuuList = this.tuanCuuList.filter(tc => tc.status === 'active');
    this.upcomingTuanCuuList = this.tuanCuuList.filter(tc => tc.status === 'upcoming');
    this.completedTuanCuuList = this.tuanCuuList.filter(tc => tc.status === 'completed');
    
    // Sort active and upcoming by the next event date
    this.activeTuanCuuList.sort((a, b) => {
      const eventA = this.getNextEvent(a);
      const eventB = this.getNextEvent(b);
      if (!eventA && !eventB) return 0;
      if (!eventA) return 1;  // b comes first if a has no next event
      if (!eventB) return -1; // a comes first if b has no next event
      return eventA.date.getTime() - eventB.date.getTime();
    });
    this.upcomingTuanCuuList.sort((a, b) => {
      const eventA = this.getNextEvent(a);
      const eventB = this.getNextEvent(b);
      if (!eventA && !eventB) return 0;
      if (!eventA) return 1;
      if (!eventB) return -1;
      return eventA.date.getTime() - eventB.date.getTime();
    });
    
    this.hasActiveTuanCuu = this.activeTuanCuuList.length > 0;
    this.hasUpcomingTuanCuu = this.upcomingTuanCuuList.length > 0;
    this.hasCompletedTuanCuu = this.completedTuanCuuList.length > 0;
  }

  // Create a new Tuan Cuu calculation
  createNewTuanCuu(): void {
    this.router.navigate(['/tuan-cuu/tinh']);
  }

  // Format a date in the local format
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    // Check if the date is valid before formatting
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    
    return this.datePipe.transform(dateObj, 'dd/MM/yyyy') || '';
  }

  // Format a date range
  formatDateRange(start: Date, end: Date): string {
    // Check if dates are valid
    const startObj = new Date(start);
    const endObj = new Date(end);
    
    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      return ''; // Return empty string if either date is invalid
    }
    
    const startFormatted = this.datePipe.transform(startObj, 'dd/MM/yyyy');
    const endFormatted = this.datePipe.transform(endObj, 'dd/MM/yyyy');
    return `${startFormatted} - ${endFormatted}`;
  }

  // Get the next event for a TuanCuu 
  getNextEvent(tuanCuu: TuanCuu): TuanCuuEvent | undefined {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    
    // Find the next event from today
    return tuanCuu.events
      .filter((event: any) => new Date(event.date) >= today)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }
  
  // Format lunar date
  formatLunarDate(lunarDate?: { day: number; month: number; year: number | string }): string {
    if (!lunarDate) return '';
    return `${lunarDate.day}/${lunarDate.month}/${lunarDate.year}`;
  }

  // Get status color for visual indication
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return '#1976d2'; // Primary blue
      case 'upcoming':
        return '#FFA000'; // Amber
      case 'completed':
        return '#4CAF50'; // Green
      default:
        return '#9E9E9E'; // Gray
    }
  }

  // Get status text for display
  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Đang thực hiện';
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return 'Không xác định';
    }
  }
  
  // Delete a Tuan Cuu entry
  async deleteTuanCuu(tuanCuuId: string, event: Event): Promise<void> {
    // Stop event propagation to prevent navigation
    event.stopPropagation();
    
    if (confirm('Bạn có chắc muốn xóa Tuần Cửu này không?')) {
      try {
        await this.tuanCuuService.deleteTuanCuu(tuanCuuId);
        this.snackBar.open('Đã xóa Tuần Cửu thành công!', 'Đóng', {
          duration: 3000
        });
        
        // Reload the list
        this.loadTuanCuuData();
      } catch (error) {
        this.snackBar.open('Lỗi khi xóa dữ liệu!', 'Đóng', {
          duration: 3000
        });
        console.error('Error deleting data:', error);
      }
    }
  }
}
