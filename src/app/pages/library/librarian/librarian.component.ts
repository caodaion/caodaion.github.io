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
  staticBooks = <any>[];
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
        this.staticBooks = res.data
        this.getReadingBooks()
        this.changeDetector.detectChanges()
      }
    })
  }

  getReadingBooks() {
    const readingBooks = JSON.parse(localStorage.getItem('reading') || '[]')
    this.staticBooks.forEach((item: any) => {
      const foundReading = readingBooks.find((rb: any) => rb?.key === item?.key)
      if (foundReading) {
        item.reading = foundReading
      }
    })
  }

  saveSettings() {
    const data = {
      data: this.staticBooks.map((item: any) => {
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


  onRead(path: any) {
    this.router.navigateByUrl(path.replace(location.origin, ''))
  }

  addNewSettings() {
    this.staticBooks.push({})
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
