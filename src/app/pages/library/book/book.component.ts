import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LibraryService } from 'src/app/shared/services/library/library.service';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnChanges {
  rootContent: any;
  content: any;
  contentName: any;
  author: any;
  origin: any;
  isLoading: boolean = true;
  isNavigation: boolean = false;
  isShowTableContent: boolean = false;
  contentEditable: boolean = false;
  isPhone: boolean = false;
  nowContent: any;
  key: any;
  level: any;
  navigate = <any>{};
  reading: any;
  library = <any>[];
  tableContent = <any>[];
  selectedIndex = 0
  cols = 4
  books = <any>[];
  setting = <any>{};
  labels = <any>[];
  selectedChips = <any>[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private libraryService: LibraryService,
    private titleService: Title,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.isNavigation = false
    this.getBooks()
    this.updateLayout()

    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1
        } else {
          this.cols = 4
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLayout()
    this.changeDetector.detectChanges()
  }

  updateLayout() {
    setTimeout(() => {
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
          this.isPhone = state.matches
          if (state.matches) {
            localStorage.setItem(
              'currentLayout',
              JSON.stringify({
                isHideToolbar: true,
                isHideBottomNavBar: true,
              })
            );
          } else {
            localStorage.setItem(
              'currentLayout',
              JSON.stringify({
                isHideToolbar: false,
                isHideBottomNavBar: false,
              })
            );
          }
          this.changeDetector.detectChanges()
        });
    }, 0)
  }



  getBooks() {
    this.updateLayout()
    this.getStaticBooks()
  }

  getBook() {
    this.route.params.subscribe((query) => {
      this.key = query['key']
    })
  }

  getStaticBooks() {
    this.libraryService.getStaticBooks().subscribe((res: any) => {
      if (res.data) {
        this.library = this.library.concat(res.data)?.filter((item: any) => item.published)
        this.getLibrary()
        this.getReadingBooks()
        this.route.queryParamMap.subscribe((query: any) => {
          this.isShowTableContent = query.params['tableContent']
        })
        this.getBook()
        this.authService.getCurrentUser()
        this.contentEditable = this.authService.contentEditable
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
            const foundData = this.books?.find((item: any) => item?.key === this.key)
            if (foundData) {
              this.isLoading = true
              this.contentName = foundData?.name;
              this.author = foundData?.author;
              this.selectedChips = foundData?.labels;
              this.changeDetector.detectChanges();
              this.content = `${foundData?.googleDocId}`
              if (this.content) {
                this.isLoading = false
              }
            }
          }
        })
    } catch (e) {
      console.error(e);
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

  onNextContent() {
    this.router
      .navigate([this.navigate.next.link], {
        queryParams: {
          autoplay: true
        },
      })
      .then(() => {
        localStorage.setItem(
          'currentLayout',
          JSON.stringify({
            isHideToolbar: true,
            isHideBottomNavBar: true,
          })
        );
      });
  }

  getNavigateLink() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    if (!this.isShowTableContent && this.level) {
      const foundContent = this.tableContent.find((item: any) => item.key === this.level)
      const foundContentInex = this.tableContent.indexOf(foundContent)
      this.navigate.prev = <any>{}
      if (this.tableContent[foundContentInex - 1]) {
        this.isNavigation = true
        this.navigate.prev.text = `${this.tableContent[foundContentInex - 1].description}`
        this.navigate.prev.link = `thu-vien/${this.key}/${this.tableContent[foundContentInex - 1].key}`
      } else {
        this.navigate.prev.link = `/`
      }
      this.navigate.next = <any>{}
      if (this.tableContent[foundContentInex + 1]) {
        this.isNavigation = true
        this.navigate.next.text = `${this.tableContent[foundContentInex + 1].description}`
        this.navigate.next.link = `thu-vien/${this.key}/${this.tableContent[foundContentInex + 1].key}`
      } else {
        this.navigate.next.link = `/`
      }
    }
  }

  onReadNow() {
    this.isLoading = true
    setTimeout(() => {
      this.router.navigate([], {
        queryParams: {
          'tableContent': null,
        },
        queryParamsHandling: 'merge'
      }).then(() => {
        this.isLoading = false
      })
    }, 0)
  }

  getBackLink() {
    return 'thu-vien'
  }

  continueReading(isAutoPlay: boolean = false) {
    if (isAutoPlay) {
      this.router.navigateByUrl(`${this.reading.location.replace(location.origin, '')}`, {
        state: { autoplay: true }
      })
    } else {
      this.router.navigateByUrl(this.reading.location.replace(location.origin, ''))
    }
  }

  generaToken(data: any) {
    const base64url = (source: any) => {
      let encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }
    const header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token
  }

  onItemFocus(item: any) {
    window.location.href = `${location.origin}/thu-vien/${item.key?.replace(location.origin, '')}`
  }
}
