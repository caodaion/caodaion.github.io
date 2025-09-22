import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { KinhService, Kinh } from '../../services/kinh.service';
import { Location } from '@angular/common';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-kinh-detail',
  templateUrl: './kinh-detail.component.html',
  styleUrls: ['./kinh-detail.component.scss'],
  standalone: false,
})
export class KinhDetailComponent implements OnInit {
  kinhContent$: Observable<string>;
  kinhInfo$: Observable<Kinh | undefined>;
  kinhKey: string = '';
  error: string | null = null;
  nextKinh: Kinh | undefined;
  prevKinh: Kinh | undefined;
  allKinhList: Kinh[] = [];
  selectedTabIndex: number = 0;

  // Font size control properties
  fontSize: number = 16;
  readonly MIN_FONT_SIZE: number = 1;
  readonly MAX_FONT_SIZE: number = 72;
  readonly FONT_SIZE_STEP: number = 1;
  fontSizeOptions: number[] = [];

  onFontSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.fontSize = Number(value);
    this.saveFontSize();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kinhService: KinhService,
    private location: Location,
    private seoService: SeoService
  ) {
    // Generate font size options for dropdown
    for (let size = this.MIN_FONT_SIZE; size <= this.MAX_FONT_SIZE; size += this.FONT_SIZE_STEP) {
      this.fontSizeOptions.push(size);
    }
    // Get the full list of kinh first
    this.kinhService.getKinhList().subscribe((kinhList) => {
      this.allKinhList = kinhList;
      this.updateNavigation();
    });

    this.kinhContent$ = this.route.paramMap.pipe(
      map((params) => params.get('key') || ''),
      tap((key) => {
        this.kinhKey = key;
        this.updateNavigation();
      }),
      switchMap((key) => {
        if (!key) {
          return of('');
        }
        return this.kinhService.getKinhByKey(key).pipe(
          catchError((error) => {
            this.error = `Unable to load kinh content: ${error.message}`;
            return of('');
          })
        );
      })
    );

    this.kinhInfo$ = this.route.paramMap.pipe(
      map((params) => params.get('key') || ''),
      switchMap((key) => {
        if (!key) {
          return of(undefined);
        }
        return this.kinhService.getKinhList().pipe(
          map((kinhList) => kinhList.find((k) => k.key === key)),
          catchError(() => of(undefined))
        );
      })
    );

    this.kinhInfo$.subscribe((kinh) => {
      if (kinh) {
        this.seoService.updateMetadata({
          title: kinh.name,
        });
      }
    });

    // Initialize font size from localStorage if available
    const savedFontSize = localStorage.getItem('kinhFontSize');
    if (savedFontSize) {
      this.fontSize = Number(savedFontSize);
    }
  }

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }

  updateNavigation(): void {
    if (!this.kinhKey || this.allKinhList.length === 0) {
      return;
    }

    const currentIndex = this.allKinhList.findIndex(
      (k) => k.key === this.kinhKey
    );
    if (currentIndex === -1) {
      return;
    }

    this.nextKinh =
      currentIndex < this.allKinhList.length - 1
        ? this.allKinhList[currentIndex + 1]
        : undefined;

    this.prevKinh =
      currentIndex > 0 ? this.allKinhList[currentIndex - 1] : undefined;
  }

  goToNextKinh(): void {
    this.selectedTabIndex = 0;
    if (this.nextKinh) {
      this.router.navigate(['/kinh', this.nextKinh.key]);
    }
  }

  goToPreviousKinh(): void {
    this.selectedTabIndex = 0;
    if (this.prevKinh) {
      this.router.navigate(['/kinh', this.prevKinh.key]);
    }
  }

  // Font size control methods
  increaseFontSize(): void {
    if (this.fontSize < this.MAX_FONT_SIZE) {
      this.fontSize += this.FONT_SIZE_STEP;
      this.saveFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize > this.MIN_FONT_SIZE) {
      this.fontSize -= this.FONT_SIZE_STEP;
      this.saveFontSize();
    }
  }

  resetFontSize(): void {
    this.fontSize = 16;
    this.saveFontSize();
  }

  private saveFontSize(): void {
    localStorage.setItem('kinhFontSize', this.fontSize.toString());
  }

  // Action methods for header controls
  shareKinh(): void {
    if (navigator.share) {
      navigator.share({
        title: `Kinh ${this.kinhKey}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Could show a toast notification here
        console.log('Link copied to clipboard');
      }).catch(console.error);
    }
  }

  bookmarkKinh(): void {
    const bookmarks = JSON.parse(localStorage.getItem('kinhBookmarks') || '[]');
    const isBookmarked = bookmarks.includes(this.kinhKey);
    
    if (isBookmarked) {
      // Remove bookmark
      const index = bookmarks.indexOf(this.kinhKey);
      bookmarks.splice(index, 1);
    } else {
      // Add bookmark
      bookmarks.push(this.kinhKey);
    }
    
    localStorage.setItem('kinhBookmarks', JSON.stringify(bookmarks));
    // Could show a toast notification here
    console.log(isBookmarked ? 'Bookmark removed' : 'Bookmark added');
  }

  isBookmarked(): boolean {
    const bookmarks = JSON.parse(localStorage.getItem('kinhBookmarks') || '[]');
    return bookmarks.includes(this.kinhKey);
  }

  printKinh(): void {
    window.print();
  }
  
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
}
