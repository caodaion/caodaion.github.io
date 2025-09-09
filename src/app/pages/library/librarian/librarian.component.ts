import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LibraryService } from 'src/app/shared/services/library/library.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from 'src/app/shared/services/common/common.service';
@Component({
    selector: 'app-librarian',
    templateUrl: './librarian.component.html',
    styleUrls: ['./librarian.component.scss'],
    standalone: false
})
export class LibrarianComponent implements OnInit {
  previewingItem: any;
  mode: any;
  googleFormsPath: any;
  editGoogleFormsPath: any;
  user: any;
  library = <any>[];
  books = <any>[];
  labels = <any>[];
  selectedChips = <any>[];
  contentEditable: boolean = false;
  loading: boolean = false;
  allowEdit: boolean = false;
  cols = 4;
  setting = <any>{}
  newBook = <any>{}

  constructor(
    private breakpointObserver: BreakpointObserver,
    private libraryService: LibraryService,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.contentEditable = this.authService.contentEditable
  }

  ngOnInit(): void {
    this.loading = true
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mode = 'over'
          this.cols = 1
        } else {
          this.mode = 'side'
          this.cols = 4
        }
      });
    this.getBooks()
    const token = localStorage.getItem('token')
    if (token) {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(token)
      this.user = decodedToken
    }
  }

  getBooks() {
    this.getStaticBooks()
  }

  getStaticBooks() {
    this.libraryService.getStaticBooks().subscribe((res: any) => {
      if (res.data) {
        if (this.books?.length === 0) {
          this.getLibrary()
        }
        this.getReadingBooks()
        this.changeDetector.detectChanges()
      }
    })
  }

  getLibrary() {
    try {
      this.libraryService.fetchLibrary()
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.books = res.data            
            this.setting = res.setting
            this.labels = res.labels
            this.loading = false
            this.allowEdit = !!this.setting[this.user?.userName]
          } else {
            this.loading = false
          }
        })
    } catch (e) {
      console.error(e);
      this.loading = false
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

  updateNewBookTitle() {
    this.newBook.key = this.commonService.generatedSlug(this.newBook?.name)
  }

  addNewBook(isClear: boolean = false) {
    if (isClear) {
      this.googleFormsPath = ''
    } else {
      if (this.newBook.key && this.newBook.name && this.newBook.googleDocId) {
        this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
        this.googleFormsPath += `?${this.setting?.key}=${encodeURIComponent(this.newBook.key)}`
        this.googleFormsPath += `&${this.setting?.name}=${encodeURIComponent(this.newBook.name)}`
        this.googleFormsPath += `&${this.setting?.googleDocId}=${encodeURIComponent(this.newBook.googleDocId)}`
        if (this.newBook.author) {
          this.googleFormsPath += `&${this.setting?.author}=${encodeURIComponent(this.newBook.author)}`
        }
        if (this.newBook.finished) {
          this.googleFormsPath += `&${this.setting?.finished}=${encodeURIComponent(this.newBook.finished)}`
        }
        if (this.newBook.cover) {
          this.googleFormsPath += `&${this.setting?.cover}=${encodeURIComponent(this.newBook.cover)}`
        }
        if (this.newBook.description) {
          this.googleFormsPath += `&${this.setting?.description}=${encodeURIComponent(this.newBook.description)}`
        }
        if (this.newBook.labels) {
          this.googleFormsPath += `&${this.setting?.labels}=${encodeURIComponent(JSON.stringify(this.newBook.labels))}`
        }
      }
    }
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }

  onClickChip(chip: any) {
    if (this.selectedChips.indexOf(chip) != -1) {
      this.selectedChips[this.selectedChips.indexOf(chip)] = null
    } else {
      this.selectedChips?.push(chip)
    }
    this.selectedChips = [... new Set(this.selectedChips)]?.filter((item: any) => !!item)
  }

  addEditNewBookToken(isClear: boolean = false, editFormTokenEx: any) {
    const editKey = () => {
      let newKey = ''
      this.newBook.key?.split('-')?.forEach((v: any) => {
        if (v?.length > 1) {
          newKey += `${v[0]}${v[v?.length - 1]}`
        } else {
          newKey += v
        }
        newKey += '-'
      })
      newKey += this.newBook.editToken?.match(/edit[0-9]/)
      return newKey
    }
    const editToken = () => {
      return this.newBook.editToken?.split(this.newBook.editToken?.match(/edit[0-9][=]/))[1]
    }
    if (isClear) {
      this.editGoogleFormsPath = ''
      editFormTokenEx.expanded = false
    } else {
      if (this.newBook.key && this.newBook.editToken) {
        this.editGoogleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`        
        this.editGoogleFormsPath += `?${this.setting?.key}=${encodeURIComponent(editKey())}`
        this.editGoogleFormsPath += `&${this.setting?.googleDocId}=${encodeURIComponent(editToken())}`
      }
    }
  }
}
