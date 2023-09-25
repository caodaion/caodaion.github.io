import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LibraryService } from 'src/app/shared/services/library/library.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  rootContent: any;
  content: any;
  isLoading: boolean = false;
  isShowTableContent: boolean = false;
  contentEditable: boolean = false;
  nowContent: any;
  level: any;
  navigate = {
    prev: {
      link: undefined,
      queryParams: {}
    },
    next: {
      link: undefined,
      queryParams: {}
    }
  };
  reading: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private libraryService: LibraryService,
    private titleService: Title,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query: any) => {
      this.isShowTableContent = query.params['tableContent']
    })
    this.route.params.subscribe((query) => {
      if (query['key'] && !query['level']) {
        this.getContent(query['key'], query['level'])
      }
      if (query['key'] && query['level']) {
        this.getContent(query['key'], query['level'])
        this.level = query['level']
        this.router.navigate(
          ['.'],
          { relativeTo: this.route, fragment: location.hash.replace('#', '') }
        );
      }
    })
    this.authService.getCurrentUser()
    this.contentEditable = this.authService.contentEditable
  }

  getContent(key?: any, level?: any) {
    this.isLoading = true
    this.libraryService.getBookByKey(key).subscribe((res: any) => {
      if (res.data) {
        this.rootContent = res.data
        if (this.rootContent?.content?.length === 0) {
          this.rootContent?.content.push({
            type: 'block',
            key: key.replaceAll('-', ''),
            content: [],
            attrs: {
              hash: '',
              pathname: location.pathname
            }
          })
        }
        this.reading = JSON.parse(localStorage.getItem('reading') || '[]')?.find((item: any) => item.key == this.rootContent?.key)
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
        if (!level) {
          this.content = res.data
          this.titleService.setTitle(`${this.content.name} | ${this.rootContent.name} | CaoDaiON`)
          this.isLoading = false
          this.getNavigateLink()
        } else {
          const find = (array: any, key: any) => {
            let result: any;
            array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
            return result;
          }
          // @ts-ignore
          this.content = find(res.data.content, location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', ''))
          this.titleService.setTitle(`${this.content?.name} | ${this.rootContent?.name} | CaoDaiON`)
          this.isLoading = false
          this.getNavigateLink()
        }
        if (location.hash) {
          setTimeout(() => {
            // @ts-ignore
            const targetedContent = document.getElementById(`${location.hash.replace('#', '')}`)
            const contentCreatorWrapper = document.getElementById('contentCreatorWrapper')
            if (targetedContent) {
              // @ts-ignore
              targetedContent.style.color = '#4285f4';
              if (contentCreatorWrapper && targetedContent) {
                // @ts-ignore
                contentCreatorWrapper.scroll({ top: targetedContent.offsetTop - (this.content.audio ? 60 : 0) })
              }
            }
          }, 0)
        } let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
        if (!studyStorage) {
          studyStorage = []
        }
        let foundItem = studyStorage.find((item: any) => item.key == this.rootContent.key)
        if (!foundItem) {
          studyStorage.push({
            name: this.rootContent.name,
            content: this.content.key || this.rootContent.key,
            key: this.rootContent.key,
            location: location.href
          })
        } else {
          if (foundItem.content !== this.content.key) {
            foundItem.content = this.content.key
            foundItem.name = this.content.name;
            foundItem.location = location.href
          }
        }
        if (this.level) {
          localStorage.setItem('reading', JSON.stringify(studyStorage))
        }
      }
    })
  }

  onSaveContent() {
    console.log(this.rootContent)
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
    if (!this.isShowTableContent) {
      this.navigate.prev.queryParams = {
        tableContent: !this.isShowTableContent
      }
      this.navigate.prev.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content?.key) - 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) - 1]?.attrs.hash) || '/'
      this.navigate.next.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content?.key) + 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) + 1]?.attrs.hash) || '/'
    } else {
      this.navigate.prev.queryParams = {}
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
    if (!this.level && !this.isShowTableContent) {
      this.navigate.prev.queryParams = {
        tableContent: !this.isShowTableContent
      }
      return location.pathname
    }
    if (this.level && !this.isShowTableContent) {
      this.navigate.prev.queryParams = {
        tableContent: !this.isShowTableContent
      }
      return ''
    }
    this.navigate.prev.queryParams = {}
    return ''
  }

  continueReading(isAutoPlay: boolean = false) {
    if (isAutoPlay) {
      this.router.navigateByUrl(`${this.reading.location.replace(location.origin, '')}`, {
        state: {autoplay: true}
      })
    } else {
      this.router.navigateByUrl(this.reading.location.replace(location.origin, ''))
    }
  }
}
