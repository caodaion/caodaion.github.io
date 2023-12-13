import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LibraryService } from 'src/app/shared/services/library/library.service';

@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrls: ['./librarian.component.scss']
})
export class LibrarianComponent implements OnInit {
  previewingItem: any;
  mode: any;
  library = <any>[];
  contentEditable: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private libraryService: LibraryService,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    this.contentEditable = this.authService.contentEditable
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mode = 'over'
        } else {
          this.mode = 'side'
        }
      });
    this.getBooks()
  }

  getBooks() {
    this.getStaticBooks()
  }

  getStaticBooks() {
    this.libraryService.getStaticBooks().subscribe((res: any) => {
      if (res.data) {
        this.library = this.library.concat(res.data)
        this.getBookFromLibrary()
        this.getReadingBooks()
        this.changeDetector.detectChanges()
      }
    })
  }

  getBookFromLibrary() {
    this.libraryService.getBookFromLibrary()
      .subscribe({
        next: (res: any) => {
          this.getReadingBooks()
          if (res.data) {
            this.library = this.library.concat(res.data)?.filter((item: any) => item.published)
          }
        }
      })
  }

  getReadingBooks() {
    const readingBooks = JSON.parse(localStorage.getItem('reading') || '[]')
    this.library.forEach((item: any) => {
      const foundReading = readingBooks.find((rb: any) => rb?.key === item?.key)
      if (foundReading) {
        item.reading = foundReading
      }
    })
  }

  saveSettings() {
    const data = {
      data: this.library.map((item: any) => {
        return {
          name: item?.name,
          image: item?.image,
          description: item?.description,
          key: item?.key,
          subtitle: item?.subtitle,
          path: item?.path,
          published: item?.published,
        }
      })
    }
    navigator.clipboard.writeText(JSON.stringify(data))
  }


  onRead(item: any, isTableContent: boolean = false) {
    if (isTableContent) {
      this.router.navigate([`trang-chu/thu-vien/${item.key?.replace(location.origin, '')}`], {
        queryParams: {
          tableContent: true
        }
      })
    } else {
      this.router.navigate([`trang-chu/thu-vien/${item.key?.replace(location.origin, '')}`])
    }
  }

  addNewSettings() {
    this.library.push({})
  }

  onItemFocus(event: any, libradianDrawer: any) {
    if (this.previewingItem?.key === event.key) {
      libradianDrawer.toggle()
    } else {
      this.previewingItem = event
      libradianDrawer.open()
    }
  }
}
