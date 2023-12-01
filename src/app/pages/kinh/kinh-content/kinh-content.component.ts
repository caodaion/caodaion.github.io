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
  content = <any>{};
  isLoading: boolean = false;
  contentEditable: boolean = false;
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

  kinhList = <any>[]
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
    this.contentEditable = this.authService.contentEditable
  }

  getKinhContent(key?: any) {
    this.isLoading = true
    this.kinhService.getKinhContent(key).subscribe((res: any) => {
      if (res) {
        this.content.key = key
        this.content.data = res
        this.isLoading = false
        // this.getEventList()
        this.getKinhList()
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
    })
  }

  getKinhList() {
    this.kinhService.getKinhList()
      .subscribe((res: any) => {
        if (res) {
          this.kinhList = res
          const foundKinhIndex = this.kinhList.findIndex((item: any) => item?.key == this.kinhKey)
          const filteredKinhList = this.kinhList.filter((item: any) => item.group == this.kinhList[foundKinhIndex]?.group)
          const filteredFoundKinhIndex = filteredKinhList.findIndex((item: any) => item?.key == this.kinhKey)
          this.content.name = filteredKinhList[filteredFoundKinhIndex]?.name
          this.titleService.setTitle(`${this.content.name} | CaoDaiON`)
          if (filteredKinhList[filteredFoundKinhIndex - 1]) {
            this.navigate.prev.link = `${location.pathname.replace(this.kinhKey, '')}${filteredKinhList[filteredFoundKinhIndex - 1]?.key}`
          } else {
            this.navigate.prev.link = `/`
          }
          if (filteredKinhList[filteredFoundKinhIndex + 1]) {
            this.navigate.next.link = `${location.pathname.replace(this.kinhKey, '')}${filteredKinhList[filteredFoundKinhIndex + 1]?.key}`
          } else {
            this.navigate.next.link = `/`
          }
        }
      });
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

    this.titleService.setTitle(`${this.content.name} | CaoDaiON`)
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
  swipeCoord: any;
  swipeTime: any;
  swipe(e: any, when: any) {
    const coord: [number, number] = [
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY,
    ];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      let direction: any[] = [];
      if (this.swipeCoord) {
        direction = [
          coord[0] - this.swipeCoord[0],
          coord[1] - this.swipeCoord[1],
        ];
      }
      let duration: any;
      if (this.swipeTime) {
        duration = time - this.swipeTime;
      }

      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const link = direction[0] < 0 ? this.navigate.next.link : this.navigate.prev.link;
        if (link !== '/') {
          // Do whatever you want with swipe
          this.router
            .navigate([link], {
              queryParams: this.queryParams,
            })
        }
      }
    }
  }
}
