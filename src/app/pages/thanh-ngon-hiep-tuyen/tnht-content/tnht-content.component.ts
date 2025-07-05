import { Component, OnInit } from '@angular/core';
import { TnhtService } from "../../../shared/services/tnht/tnht.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Title } from "@angular/platform-browser";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from "crypto-js";

@Component({
    selector: 'app-tnht-content',
    templateUrl: './tnht-content.component.html',
    styleUrls: ['./tnht-content.component.scss'],
    standalone: false
})
export class TnhtContentComponent implements OnInit {
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
  contentEditable: boolean = false

  constructor(
    private tnhtService: TnhtService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
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
      }
    })
    this.router.navigate(
      ['.'],
      { relativeTo: this.route, fragment: location.hash.replace('#', '') }
    );
    this.contentEditable = this.authService.contentEditable
  }

  getContent(key?: any, level?: any) {
    this.isLoading = true
    this.tnhtService.getTNHTByPath(key).subscribe((res: any) => {
      if (res.data) {
        this.rootContent = res.data
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
          this.content = find(res.data.content, location.pathname.slice(0, location.pathname.length).split('/').slice(0).join('-').replaceAll('-', ''))
          this.titleService.setTitle(`${this.content.name} | ${this.rootContent.name} | CaoDaiON`)
          this.isLoading = false
          this.getNavigateLink()
        }
        if (location.hash) {
          if (location.pathname.includes('thanh-ngon-hiep-tuyen')) {
            setTimeout(() => {
              // @ts-ignore
              const targetedContent = document.getElementById(`${location.hash.replace('#', '')}`)
              const contentCreatorWrapper = document.getElementById('contentCreatorWrapper')
              if (targetedContent) {
                targetedContent.style.color = '#4285f4';
                // @ts-ignore
                contentCreatorWrapper.scroll({ top: targetedContent.offsetTop - (this.content.audio ? 60 : 0) })
              }
            }, 0)
          }
        }
        let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
        if (!studyStorage) {
          studyStorage = []
        }
        if (level) {
          localStorage.setItem('reading', JSON.stringify(studyStorage))
        }
      }
    })
  }

  onSaveContent() {
    console.log(this.rootContent)
    navigator.clipboard.writeText(JSON.stringify({ data: this.rootContent }));
  }

  getNavigateLink() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    this.navigate.prev.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) - 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) - 1]?.attrs.hash) || '/'
    this.navigate.next.link = (this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) + 1]?.attrs.pathname + this.rootContent.content[this.rootContent.content.findIndex((item: any) => item.key == this.content.key) + 1]?.attrs.hash) || '/'
  }

  onNextContent() {
    if (this.rootContent?.content?.findIndex((item: any) => item?.key == this.content?.key) < this.rootContent?.content?.length - 1) {
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
          const contentCreatorWrapper = document.getElementById('contentCreatorWrapper')
          contentCreatorWrapper?.scrollTo({
            top: 0
          })
        });
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

  updateFontSize(event: any) {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const token = localStorage.getItem('token')
    if (token) {
      const jwtHelper = new JwtHelperService()
      const decodedToken = jwtHelper.decodeToken(token)
      decodedToken.fontSize = event
      if (users[decodedToken.userName]) {
        users[decodedToken.userName] = this.generaToken(decodedToken)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('token', JSON.stringify(this.generaToken(decodedToken)))
      }
    }
  }
}
