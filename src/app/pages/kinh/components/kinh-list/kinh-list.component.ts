import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KinhService, Kinh } from '../../services/kinh.service';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { SeoService } from '../../../../shared/services/seo.service';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-kinh-list',
  standalone: false,
  templateUrl: './kinh-list.component.html',
  styleUrls: ['./kinh-list.component.scss'],
})
export class KinhListComponent implements OnInit {
  private searchTerm$ = new BehaviorSubject<string>('');
  private selectedGroups$ = new BehaviorSubject<string[]>([]);
  private allGroups$: Observable<{ [key: string]: Kinh[] }>;

  kinhGroups$: Observable<{ [key: string]: Kinh[] }>;
  availableGroups$: Observable<string[]>;
  expandedGroups: { [key: string]: boolean } = {};
  selectedGroups: string[] = [];
  showFilters: boolean = false;

  displayType: 'grid' | 'list' = 'list';

  constructor(
    private kinhService: KinhService,
    private seoService: SeoService,
    private commonService: CommonService
  ) {
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
    this.allGroups$.subscribe((groups) => {
      Object.keys(groups).forEach((key) => {
        this.expandedGroups[key] = true;
      });
    });

    // Load view mode from localStorage if available
    const savedViewMode = localStorage.getItem('kinhViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      this.displayType = savedViewMode;
    }
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
}
