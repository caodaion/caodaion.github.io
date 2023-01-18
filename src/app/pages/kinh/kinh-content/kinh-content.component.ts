import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { KinhService } from "../../../shared/services/kinh/kinh.service";
import { EventService } from "../../../shared/services/event/event.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-kinh-content',
  templateUrl: './kinh-content.component.html',
  styleUrls: ['./kinh-content.component.scss']
})
export class KinhContentComponent implements OnInit {
  rootContent: any;
  content: any;
  isLoading: boolean = false;
  nowContent: any;
  navigate = {
    prev: {
      link: '/',
    },
    next: {
      link: '/',
    }
  };
  kinhKey: any;
  eventList = this.eventService.eventList
  queryParams = {
    me: '',
    e: ''
  }
  constructor(
    private kinhService: KinhService,
    public eventService: EventService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['kinhKey']) {
        this.kinhKey = query['kinhKey']
        this.getKinhContent(query['kinhKey'])
      }
    })
    this.route.queryParams.subscribe((query) => {
      if (query['me'] && query['e']) {
        this.queryParams.me = query['me']
        this.queryParams.e = query['e']
      }
      this.router.navigate(
        ['.'],
        {
          relativeTo: this.route,
          fragment: location.hash.replace('#', ''),
          queryParams: {
            me: this.queryParams.me,
            e: this.queryParams.e
          }
        }
      );
    })
  }

  getKinhContent(key?: any) {
    this.isLoading = true
    this.kinhService.getKinhContent(key).subscribe((res: any) => {
      if (res.data) {
        this.rootContent = res.data
        this.content = res.data
        if (!this.content.formGroup || this.content.formGroup.length == 0) {
          this.content.formGroup = []
        }
        this.updateForm()
        console.log(this.content)
        this.titleService.setTitle(`${this.content.name} | CaoDaiON`)
        this.isLoading = false
        this.getEventList()
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
        if (location.hash) {
          if (location.pathname.includes('kinh')) {
            setTimeout(() => {
              // @ts-ignore
              const targetedContent = document.getElementById(`${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${location.hash.replace('#', '')}`)
              // @ts-ignore
              targetedContent.style.color = '#4285f4';
              const contentCreatorWrapper = document.getElementById('contentCreatorWrapper')
              // @ts-ignore
              contentCreatorWrapper.scroll({ top: targetedContent.offsetTop })
            }, 0)
          }
        }
      }
    })
  }

  onSaveContent() {
    if (!this.rootContent.key) {
      this.rootContent.key = this.kinhKey
      this.rootContent.type = 'block'
    }
    this.rootContent.event = 'quan-hon-tang-te'
    console.log({ data: this.rootContent })
    navigator.clipboard.writeText(JSON.stringify({ data: this.rootContent }));
  }

  private getEventList() {
    const currentMainEvent = this.eventList.find((item: any) => item.key == (this.queryParams.me || this.rootContent?.event))
    const currentEvent = currentMainEvent.event.find((item: any) => item.key == (this.queryParams.e || this.rootContent?.event))
    if (currentEvent.kinh[currentEvent.kinh.findIndex((item: any) => item == this.kinhKey) - 1]) {
      this.navigate.prev.link = `${location.pathname.replace(this.kinhKey, '')}${currentEvent.kinh[currentEvent.kinh.findIndex((item: any) => item == this.kinhKey) - 1]}`
    } else {
      this.navigate.prev.link = `/`
    }
    if (currentEvent.kinh[currentEvent.kinh.findIndex((item: any) => item == this.kinhKey) + 1]) {
      this.navigate.next.link = `${location.pathname.replace(this.kinhKey, '')}${currentEvent.kinh[currentEvent.kinh.findIndex((item: any) => item == this.kinhKey) + 1]}`
    } else {
      this.navigate.next.link = `/`
    }
  }

  updateForm() {
    if (!this.content.formGroup?.find((item: any) => item.key === 'ten-khac-phan-loai')) {
      this.content.formGroup.push({
        key: 'ten-khac-phan-loai',
        label: 'Tên khác/Phân loại',
        value: '',
        required: false,
        type: 'shortText'
      })
    }
    if (!this.content.formGroup?.find((item: any) => item.key === 'giong-doc')) {
      this.content.formGroup.push({
        key: 'giong-doc',
        label: 'Giọng Đọc',
        data: ['Giọng Nam Ai', 'Giọng Nam Xuân'],
        value: '',
        required: false,
        type: 'radio'
      })
    }
  }

  getFormValue(key: string) {
    return this.content?.formGroup?.find((item: any) => item.key === key)?.value || ''
  }
}
