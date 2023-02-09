import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  nowContent: any;
  navigate = {
    prev: {
      link: undefined,
    },
    next: {
      link: undefined,
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private libraryService: LibraryService,
    private titleService: Title
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['key'] && !query['level']) {
        this.getContent(query['key'], query['level'])
      }
      if (query['key'] && query['level']) {
        this.getContent(query['key'], query['level'])
        this.router.navigate(
          ['.'],
          { relativeTo: this.route, fragment: location.hash.replace('#', '') }
        );
      }
    })
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
            const targetedContent = document.getElementById(`${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${location.hash.replace('#', '')}`)
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
        localStorage.setItem('reading', JSON.stringify(studyStorage))
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
    this.navigate.prev.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content?.key) - 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) - 1]?.attrs.hash) || '/'
    this.navigate.next.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content?.key) + 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) + 1]?.attrs.hash) || '/'
  }
}