import { Component, OnInit, Optional, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { KinhService, Kinh } from '../../services/kinh.service';
import { BehaviorSubject, Observable, combineLatest, map, Subscription } from 'rxjs';
import { SeoService } from '../../../../shared/services/seo.service';
import { CommonService } from '../../../../shared/services/common.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { KinhScrollPositionService } from '../../../../shared/services/kinh-scroll-position/kinh-scroll-position.service';

@Component({
  selector: 'app-kinh-list',
  standalone: false,
  templateUrl: './kinh-list.component.html',
  styleUrls: ['./kinh-list.component.scss'],
})
export class KinhListComponent implements OnInit, OnDestroy, AfterViewInit {
  private searchTerm$ = new BehaviorSubject<string>('');
  private selectedGroups$ = new BehaviorSubject<string[]>([]);
  private allGroups$: Observable<{ [key: string]: Kinh[] }>;

  kinhGroups$: Observable<{ [key: string]: Kinh[] }>;
  availableGroups$: Observable<string[]>;
  expandedGroups: { [key: string]: boolean } = {};
  selectedGroups: string[] = [];
  showFilters: boolean = false;

  displayType: 'grid' | 'list' = 'list';
  
  private subscriptions: Subscription[] = [];
  private isBottomSheet: boolean = false;

  constructor(
    private kinhService: KinhService,
    private seoService: SeoService,
    private commonService: CommonService,
    private router: Router,
    private kinhScrollService: KinhScrollPositionService,
    @Optional() private bottomSheetRef: MatBottomSheetRef<KinhListComponent>
  ) {
    this.isBottomSheet = !!this.bottomSheetRef;
    this.allGroups$ = this.kinhService.getKinhGroups();
    
    // Get available groups for the filter chips
    this.availableGroups$ = this.allGroups$.pipe(
      map(groups => Object.keys(groups))
    );
    
    this.kinhGroups$ = combineLatest([this.allGroups$, this.searchTerm$, this.selectedGroups$]).pipe(
      map(([groups, searchTerm, selectedGroups]) => {
        let filteredGroups = groups;

        // Filter by selected groups first
        if (selectedGroups.length > 0) {
          const groupsFilteredBySelection: { [key: string]: Kinh[] } = {};
          selectedGroups.forEach(groupKey => {
            if (groups[groupKey]) {
              groupsFilteredBySelection[groupKey] = groups[groupKey];
            }
          });
          filteredGroups = groupsFilteredBySelection;
        }

        // Then apply search filter
        if (!searchTerm.trim()) {
          return filteredGroups;
        }

        const searchFilteredGroups: { [key: string]: Kinh[] } = {};
        const searchContent = this.commonService.generatedSlug(searchTerm);

        Object.keys(filteredGroups).forEach((key) => {
          const filteredKinhs = filteredGroups[key].filter((kinh) =>
            this.commonService.generatedSlug(kinh.name).includes(searchContent) ||
            this.commonService.generatedSlug(kinh.key).includes(searchContent)
          );

          if (filteredKinhs.length > 0) {
            searchFilteredGroups[key] = filteredKinhs;
          }
        });

        return searchFilteredGroups;
      })
    );
  }

  ngOnInit(): void {
    this.seoService.updateMetadata({
      title: 'Kinh',
      description: 'Danh sách các bài kinh',
      keywords:
        'Kinh, Kinh Cúng Tứ Thời, Kinh Quan Hôn Tang Tế',
    });
    
    // Initialize all groups as expanded
    this.subscriptions.push(
      this.allGroups$.subscribe((groups) => {
        Object.keys(groups).forEach((key) => {
          this.expandedGroups[key] = true;
        });
      })
    );

    // Load view mode from localStorage if available
    const savedViewMode = localStorage.getItem('kinhViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      this.displayType = savedViewMode;
    }

  }

  ngAfterViewInit(): void {
    // Always scroll to the last selected kinh after view is initialized
    this.scrollToSelectedKinh();
    
    // Also try after a minimal delay as fallback
    setTimeout(() => {
      this.scrollToSelectedKinh();
    }, 50);
  }

  /**
   * Scroll to the selected kinh based on current context (list or bottom sheet)
   */
  private scrollToSelectedKinh(): void {
    if (this.isBottomSheet) {
      this.kinhScrollService.scrollToSelectedKinhInBottomSheet();
    } else {
      // For kinh list screen, use .main-container
      this.kinhScrollService.scrollToSelectedKinhInList('.main-container');
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setDisplayType(type: 'grid' | 'list') {
    this.displayType = type;
    localStorage.setItem('kinhViewMode', type);
  }

  toggleGroup(groupKey: string): void {
    this.expandedGroups[groupKey] = !this.expandedGroups[groupKey];
  }

  getGroupName(key: string): string {
    return this.kinhService.getGroupName(key);
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }

  toggleGroupFilter(groupKey: string): void {
    if (this.selectedGroups.includes(groupKey)) {
      this.selectedGroups = this.selectedGroups.filter(g => g !== groupKey);
    } else {
      this.selectedGroups = [...this.selectedGroups, groupKey];
    }
    this.selectedGroups$.next(this.selectedGroups);
  }

  clearGroupFilters(): void {
    this.selectedGroups = [];
    this.selectedGroups$.next(this.selectedGroups);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isGroupSelected(groupKey: string): boolean {
    return this.selectedGroups.includes(groupKey);
  }

  originalOrder = (a: any, b: any): number => {
    return 0; // Keep original order, don't sort
  }

  isGrid(): boolean {
    return this.displayType === 'grid';
  }
  isList(): boolean {
    return this.displayType === 'list';
  }

  /**
   * Navigate to kinh detail page and close the bottom sheet if opened as bottom sheet
   * @param kinhKey The key of the kinh to navigate to
   */
  navigateToKinh(kinhKey: string): void {
    // Save the selected kinh key for scroll positioning
    this.kinhScrollService.setSelectedKinhKey(kinhKey);
    
    this.router.navigate(['/kinh', kinhKey]);
    
    // Only dismiss bottom sheet if component is opened as bottom sheet
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }
}
