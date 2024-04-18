import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LibraryService } from 'src/app/shared/services/library/library.service';

@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrls: ['./librarian.component.scss']
})
export class LibrarianComponent implements OnInit, AfterViewChecked {
  previewingItem: any;
  mode: any;
  library = <any>[];
  tabs = <any>[];
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

  ngAfterViewChecked(): void {
    if (this.tabs?.length === 0) {
      this.getTabLibrary()
    }
  }

  getBooks() {
    this.getStaticBooks()
  }

  getStaticBooks() {
    this.libraryService.getStaticBooks().subscribe((res: any) => {
      if (res.data) {
        // this.library = this.library.concat(res.data)
        this.getTabLibrary()
        this.getReadingBooks()
        this.changeDetector.detectChanges()
      }
    })
  }

  getTabLibrary() {
    this.tabs = <any>[];
    try {
      this.tabs = this.libraryService.libraryList?.map((item: any) => { return { tab: item } })
      if (this.tabs?.length > 0) {
        this.tabs?.forEach((item: any) => {
          this.getBookFromLibrary(item);
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  getBookFromLibrary(item: any) {
    this.library = <any>[];
    try {
      this.libraryService.getBookFromLibrary({ tab: item?.tab })
        .subscribe((res: any) => {
          this.getReadingBooks()
          if (res.code === 200) {
            item.library = res?.data?.filter((item: any) => item.published && item?.googleDocId)
          }
        })
    } catch (err) {
      console.log(err);
    }
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
      this.router.navigate([`thu-vien/${item.key?.replace(location.origin, '')}`], {
        queryParams: {
          tableContent: true
        }
      })
    } else {
      this.router.navigate([`thu-vien/${item.key?.replace(location.origin, '')}`])
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
