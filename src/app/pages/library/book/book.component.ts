import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class BookComponent implements OnInit {
  rootContent: any;
  content: any;
  contentName: any;
  isLoading: boolean = false;
  isNavigation: boolean = false;
  isShowTableContent: boolean = false;
  contentEditable: boolean = false;
  nowContent: any;
  key: any;
  level: any;
  navigate = <any>{};
  reading: any;
  fontSize: number = 18;
  fontSizeRange = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
  library = <any>[];
  tableContent = <any>[];

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
    setTimeout(() => {
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
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
        });
    }, 0)
  }



  getBooks() {
    this.getStaticBooks()
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
          }
        },
        complete: () => {
          if (this.isShowTableContent) {
            const foundContent = this.library.find((item: any) => item.key === this.key)
            this.getTableContentByKey(this.key, foundContent?.isStatic)
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
    const foundContent = this.library.find((item: any) => item.key === key)
    this.contentName = foundContent?.name
    this.libraryService.getBookByKey(key, foundContent?.isStatic)
      .subscribe((res: any) => {
        if (res) {
          this.content = res
          this.isLoading = false
          this.getTableContentByKey(key, foundContent?.isStatic)
        }
      })
  }

  getTableContentByKey(key: any, isStatic: any) {
    this.libraryService.getTableContentByKey(key, isStatic)
      .subscribe((res: any) => {
        if (res) {
          this.tableContent = res.data
          this.getNavigateLink()
          if (this.level) {
            this.getDataOfTableContent(key, { key: this.level }, isStatic)
          } else {
            this.tableContent?.forEach((item: any) => {
              this.getDataOfTableContent(key, item, isStatic)
            })
          }
        }
      })
  }

  getDataOfTableContent(key: any, item: any, isStatic: any) {
    this.libraryService.getDataOfTableContent(`${key}/${item.key}`, isStatic)
      .subscribe((res: any) => {
        if (res) {
          if (this.level) {
            this.content = res
          } else {
            item.content = res
          }
        }
      })
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

  getContentName(item: any) {
    if (!item?.name) {
      let name = ''
      item?.content[0]?.content.forEach((text: any) => {
        if (text.type == 'text') {
          name += text?.text
        }
      })
      return name
    }
    return item?.name
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
