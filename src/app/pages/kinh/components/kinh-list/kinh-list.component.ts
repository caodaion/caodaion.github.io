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
  private allGroups$: Observable<{ [key: string]: Kinh[] }>;

  kinhGroups$: Observable<{ [key: string]: Kinh[] }>;
  expandedGroups: { [key: string]: boolean } = {};

  displayType: 'grid' | 'list' = 'list';

  constructor(
    private kinhService: KinhService,
    private seoService: SeoService,
    private commonService: CommonService
  ) {
    this.allGroups$ = this.kinhService.getKinhGroups();
    this.kinhGroups$ = combineLatest([this.allGroups$, this.searchTerm$]).pipe(
      map(([groups, searchTerm]) => {
        if (!searchTerm.trim()) {
          return groups;
        }

        const filteredGroups: { [key: string]: Kinh[] } = {};
        const searchContent = this.commonService.generatedSlug(searchTerm);

        Object.keys(groups).forEach((key) => {
          const filteredKinhs = groups[key].filter((kinh) =>
            this.commonService.generatedSlug(kinh.name).includes(searchContent) ||
            this.commonService.generatedSlug(kinh.key).includes(searchContent)
          );

          if (filteredKinhs.length > 0) {
            filteredGroups[key] = filteredKinhs;
          }
        });

        return filteredGroups;
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

  isGrid(): boolean {
    return this.displayType === 'grid';
  }
  isList(): boolean {
    return this.displayType === 'list';
  }
}
