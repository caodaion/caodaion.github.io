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
export class BookComponent implements OnInit, OnChanges, AfterViewChecked {
  rootContent: any;
  content: any;
  contentName: any;
  origin: any;
  isLoading: boolean = false;
  isNavigation: boolean = false;
  isShowTableContent: boolean = false;
  contentEditable: boolean = false;
  isPhone: boolean = false;
  nowContent: any;
  key: any;
  level: any;
  navigate = <any>{};
  reading: any;
  fontSize: number = 18;
  fontSizeRange = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
  library = <any>[];
  tableContent = <any>[];
  selectedIndex = 0

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLayout()
    this.changeDetector.detectChanges()
  }

  ngAfterViewChecked(): void {
    this.getTableContentByKey()
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
      if (query['key'] && !query['level']) {
        if (!this.isShowTableContent) {
          this.getContent(query['key'], query['level'])
        }
      }
      if (query['key'] && query['level']) {
        this.level = query['level']
        if (!this.isShowTableContent) {
          this.getContent(query['key'], query['level'])
          this.router.navigate(
            ['.'],
            { relativeTo: this.route, fragment: location.hash.replace('#', '') }
          );
        }
      }
    })
  }

  getStaticBooks() {
    this.libraryService.getStaticBooks().subscribe((res: any) => {
      if (res.data) {
        this.library = this.library.concat(res.data)?.filter((item: any) => item.published)
        this.getBookFromLibrary()
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

  getBookFromLibrary() {
    this.libraryService.getBookFromLibrary()
      .subscribe({
        next: (res: any) => {
          this.getReadingBooks()
          if (res.data) {
            this.library = this.library.concat(res.data)?.filter((item: any) => item.published)
            this.getBook()
          }
        },
        complete: () => {
          if (this.isShowTableContent) {
            const foundContent = this.library.find((item: any) => item.key === this.key)
            this.getTableContentByKey()
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

  getContent(key?: any, level?: any) {
    this.isLoading = true
    this.origin = null
    const foundContent: any = this.library.find((item: any) => item.key === key)
    this.contentName = foundContent?.name;
    this.changeDetector.detectChanges();
    this.libraryService.getBookByKey(key, foundContent?.isStatic)
      .subscribe((res: any) => {
        if (res) {
          this.content = res.data
          this.origin = foundContent?.origin
          this.isLoading = false
          this.getTableContentByKey()
        }
      })
  }

  getTableContentByKey() {
    if (this.tableContent?.length === 0) {
      const content = document.getElementById('markdownContent')
      content?.childNodes.forEach((node: any) => {
        if (node.id) {
          this.tableContent.push({
            key: node.id,
            description: node.textContent
          })
        }
        this.tableContent = [...new Set(this.tableContent)]
        this.changeDetector.detectChanges();
      })
    }
  }

  onSaveContent() {
    navigator.clipboard.writeText(JSON.stringify({ data: this.rootContent }));
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
        this.navigate.prev.link = `trang-chu/thu-vien/${this.key}/${this.tableContent[foundContentInex - 1].key}`
      } else {
        this.navigate.prev.link = `/`
      }
      this.navigate.next = <any>{}
      if (this.tableContent[foundContentInex + 1]) {
        this.isNavigation = true
        this.navigate.next.text = `${this.tableContent[foundContentInex + 1].description}`
        this.navigate.next.link = `trang-chu/thu-vien/${this.key}/${this.tableContent[foundContentInex + 1].key}`
      } else {
        this.navigate.next.link = `/`
      }
    }
  }

  readContent(item: any) {
    if (item?.attrs?.hash?.includes('#')) {
      this.router.navigate([item?.attrs?.pathname], { fragment: item?.attrs?.hash.replace('#', '') })
    } else {
      this.router.navigate([`${item?.attrs?.pathname}${item?.attrs?.hash || ''}`])
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
    return 'trang-chu/thu-vien'
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

  updateFontSize() {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const token = localStorage.getItem('token')
    if (token) {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(token)
      decodedToken.fontSize = this.fontSize
      if (users[decodedToken.userName]) {
        users[decodedToken.userName] = this.generaToken(decodedToken)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('token', JSON.stringify(this.generaToken(decodedToken)))
      }
    }
  }
}
