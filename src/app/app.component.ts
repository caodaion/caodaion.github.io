import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService} from './shared/services/auth/auth.service';
import {CommonService} from './shared/services/common/common.service';
import {EventService} from './shared/services/event/event.service';
import {KinhService} from './shared/services/kinh/kinh.service';
import {Meta, Title} from "@angular/platform-browser";
import {CONSTANT} from "./shared/constants/constants.constant";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gettingCommonData: boolean = true

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private kinhService: KinhService,
    private eventService: EventService,
    private meta: Meta,
    private route: ActivatedRoute,
    private title: Title
  ) {
    router.events.subscribe((val: any) => {
      localStorage.setItem(
        'currentLayout',
        JSON.stringify({
          isHideToolbar: false,
          isHideBottomNavBar: false,
        })
      );
      this.authService.getCurrentUser();
    });
    this.addTag()
  }

  ngOnInit(): void {
    this.gettingCommonData = true
    this.commonService.getTimeList().subscribe((res: any) => {
      if (res) {
        this.commonService.commonTimes = res.data;
        this.commonService.getLocationTypeList().subscribe((res: any) => {
          if (res) {
            this.commonService.commonLocationTypes = res.data;
            this.commonService.getDateList().subscribe((res: any) => {
              if (res) {
                this.commonService.commonDates = res.data;
                for (let i = 1; i <= 31; i++) {
                  if (i <= 12) {
                    this.commonService.commonDates.month.push({
                      key: i < 10 ? `0${i}` : i.toString(),
                      name: `tháng ${i}`,
                    });
                  }
                  this.commonService.commonDates.date.push({
                    key: i < 10 ? `0${i}` : i.toString(),
                    name: i,
                  });
                }
                this.kinhService.getKinhList()
                  .subscribe((res: any) => {
                    if (res) {
                      this.kinhService.kinhList = res.data;
                      this.eventService.getEventList().subscribe((res: any) => {
                        if (res) {
                          this.eventService.eventList = res.data;
                          this.gettingCommonData = false
                        }
                      });
                    }
                  });
              }
            })
          }
        })
      }
    });
  }

  private addTag() {
    this.meta.addTag({name: 'description', content: CONSTANT.page.description})
    this.meta.addTag({name: 'title', content: CONSTANT.page.name})
    this.meta.addTag({name: 'og:title', content: CONSTANT.page.name})
    this.meta.addTag({name: 'og:url', content: location.origin})
    this.meta.addTag({name: 'og:image', content: `https://lh3.googleusercontent.com/pw/AL9nZEUpNZiT6WM4-73zvBfCJjp1BEyABWpztUxBErMNfPq9-nu_zzV_HK3Tpr2TzN6vfneFMEphqfeHacn7Q2vBRyPgCzY0BYNvMjWWC99MNOQpSQl6BL3AiNVdoJpq6ceczgC3wYKtMRXfiywYDux2_RhA5__Yw3rEI0RyuN5EWkTMgzW2RzsR8JaNUC77umUvmXbMHzN9d_4uUCgZiJ1_MPdGF623lhPn1zKE7oukdpu5gvPQLjJWZ2b_DXAT4hhZpymlJtNc3Fdt7-QTQFet77W0lraYijY3LMidIqF-1TpLSdPT8P1EY5G6et73HLrWJjw1-YRPlAn35v4_xYLIUqL2D18eEyEehIzUPJWYUrGOuaazO0dyQ71x234HkjWD4l02mRdv5qYlaLG8vEWsXeV3LnB_0FvS8RNFlOK8eFaJJND2Ao_SDQQza7gaUR94lx1pQ0vLERea9U0XFl2i0lz-JU4ycrJA__isTM0qjlNE20-uqMdhvazDZmgVtClF6YHNmm9Cfw6bcV8XCFjCfraVzUhAcdjFrgFK3xHVcD12Mr4cUSyGUXiQ-VwQlZri2P6vsqPl0RBILXK1-n3DZ7ehTgNZPS-36efnaNKLT83MDnoTMYxuVnOqnoj3RLWjoAx9EuaG-7FF7Z-gxb025sUxWUQkIWZwvFLmMvSlBx5c-XFNScKsF8GX2vNghVpmIACo-s0xkiLK-Jb27Q62dI6njv56hgucrBFt2uGSh_vmYeJ9tUxOLAqBKfn9_pEfe3rlMcLbOs1eog5ODt1Q3DeQMlfEexzGbJauIAiRxNx5VIyzKT7-weagiKdEW6oqOeTvF9mYjyAP9ZUVO6U0n1vadEIZ5vqCXt3r1PSWTL-HDESnu7sPu8sdhmcxqXtdEwPqykI7MCZ3DaV8nMvArgPlJA=s396-no?authuser=0`})
    this.meta.addTag({name: 'og:image:secure_url', content: `https://lh3.googleusercontent.com/pw/AL9nZEUpNZiT6WM4-73zvBfCJjp1BEyABWpztUxBErMNfPq9-nu_zzV_HK3Tpr2TzN6vfneFMEphqfeHacn7Q2vBRyPgCzY0BYNvMjWWC99MNOQpSQl6BL3AiNVdoJpq6ceczgC3wYKtMRXfiywYDux2_RhA5__Yw3rEI0RyuN5EWkTMgzW2RzsR8JaNUC77umUvmXbMHzN9d_4uUCgZiJ1_MPdGF623lhPn1zKE7oukdpu5gvPQLjJWZ2b_DXAT4hhZpymlJtNc3Fdt7-QTQFet77W0lraYijY3LMidIqF-1TpLSdPT8P1EY5G6et73HLrWJjw1-YRPlAn35v4_xYLIUqL2D18eEyEehIzUPJWYUrGOuaazO0dyQ71x234HkjWD4l02mRdv5qYlaLG8vEWsXeV3LnB_0FvS8RNFlOK8eFaJJND2Ao_SDQQza7gaUR94lx1pQ0vLERea9U0XFl2i0lz-JU4ycrJA__isTM0qjlNE20-uqMdhvazDZmgVtClF6YHNmm9Cfw6bcV8XCFjCfraVzUhAcdjFrgFK3xHVcD12Mr4cUSyGUXiQ-VwQlZri2P6vsqPl0RBILXK1-n3DZ7ehTgNZPS-36efnaNKLT83MDnoTMYxuVnOqnoj3RLWjoAx9EuaG-7FF7Z-gxb025sUxWUQkIWZwvFLmMvSlBx5c-XFNScKsF8GX2vNghVpmIACo-s0xkiLK-Jb27Q62dI6njv56hgucrBFt2uGSh_vmYeJ9tUxOLAqBKfn9_pEfe3rlMcLbOs1eog5ODt1Q3DeQMlfEexzGbJauIAiRxNx5VIyzKT7-weagiKdEW6oqOeTvF9mYjyAP9ZUVO6U0n1vadEIZ5vqCXt3r1PSWTL-HDESnu7sPu8sdhmcxqXtdEwPqykI7MCZ3DaV8nMvArgPlJA=s396-no?authuser=0`})
    this.meta.addTag({name: 'image', content: `https://lh3.googleusercontent.com/pw/AL9nZEUpNZiT6WM4-73zvBfCJjp1BEyABWpztUxBErMNfPq9-nu_zzV_HK3Tpr2TzN6vfneFMEphqfeHacn7Q2vBRyPgCzY0BYNvMjWWC99MNOQpSQl6BL3AiNVdoJpq6ceczgC3wYKtMRXfiywYDux2_RhA5__Yw3rEI0RyuN5EWkTMgzW2RzsR8JaNUC77umUvmXbMHzN9d_4uUCgZiJ1_MPdGF623lhPn1zKE7oukdpu5gvPQLjJWZ2b_DXAT4hhZpymlJtNc3Fdt7-QTQFet77W0lraYijY3LMidIqF-1TpLSdPT8P1EY5G6et73HLrWJjw1-YRPlAn35v4_xYLIUqL2D18eEyEehIzUPJWYUrGOuaazO0dyQ71x234HkjWD4l02mRdv5qYlaLG8vEWsXeV3LnB_0FvS8RNFlOK8eFaJJND2Ao_SDQQza7gaUR94lx1pQ0vLERea9U0XFl2i0lz-JU4ycrJA__isTM0qjlNE20-uqMdhvazDZmgVtClF6YHNmm9Cfw6bcV8XCFjCfraVzUhAcdjFrgFK3xHVcD12Mr4cUSyGUXiQ-VwQlZri2P6vsqPl0RBILXK1-n3DZ7ehTgNZPS-36efnaNKLT83MDnoTMYxuVnOqnoj3RLWjoAx9EuaG-7FF7Z-gxb025sUxWUQkIWZwvFLmMvSlBx5c-XFNScKsF8GX2vNghVpmIACo-s0xkiLK-Jb27Q62dI6njv56hgucrBFt2uGSh_vmYeJ9tUxOLAqBKfn9_pEfe3rlMcLbOs1eog5ODt1Q3DeQMlfEexzGbJauIAiRxNx5VIyzKT7-weagiKdEW6oqOeTvF9mYjyAP9ZUVO6U0n1vadEIZ5vqCXt3r1PSWTL-HDESnu7sPu8sdhmcxqXtdEwPqykI7MCZ3DaV8nMvArgPlJA=s396-no?authuser=0`})
    this.meta.addTag({name: 'twitter:image', content: `https://lh3.googleusercontent.com/pw/AL9nZEUpNZiT6WM4-73zvBfCJjp1BEyABWpztUxBErMNfPq9-nu_zzV_HK3Tpr2TzN6vfneFMEphqfeHacn7Q2vBRyPgCzY0BYNvMjWWC99MNOQpSQl6BL3AiNVdoJpq6ceczgC3wYKtMRXfiywYDux2_RhA5__Yw3rEI0RyuN5EWkTMgzW2RzsR8JaNUC77umUvmXbMHzN9d_4uUCgZiJ1_MPdGF623lhPn1zKE7oukdpu5gvPQLjJWZ2b_DXAT4hhZpymlJtNc3Fdt7-QTQFet77W0lraYijY3LMidIqF-1TpLSdPT8P1EY5G6et73HLrWJjw1-YRPlAn35v4_xYLIUqL2D18eEyEehIzUPJWYUrGOuaazO0dyQ71x234HkjWD4l02mRdv5qYlaLG8vEWsXeV3LnB_0FvS8RNFlOK8eFaJJND2Ao_SDQQza7gaUR94lx1pQ0vLERea9U0XFl2i0lz-JU4ycrJA__isTM0qjlNE20-uqMdhvazDZmgVtClF6YHNmm9Cfw6bcV8XCFjCfraVzUhAcdjFrgFK3xHVcD12Mr4cUSyGUXiQ-VwQlZri2P6vsqPl0RBILXK1-n3DZ7ehTgNZPS-36efnaNKLT83MDnoTMYxuVnOqnoj3RLWjoAx9EuaG-7FF7Z-gxb025sUxWUQkIWZwvFLmMvSlBx5c-XFNScKsF8GX2vNghVpmIACo-s0xkiLK-Jb27Q62dI6njv56hgucrBFt2uGSh_vmYeJ9tUxOLAqBKfn9_pEfe3rlMcLbOs1eog5ODt1Q3DeQMlfEexzGbJauIAiRxNx5VIyzKT7-weagiKdEW6oqOeTvF9mYjyAP9ZUVO6U0n1vadEIZ5vqCXt3r1PSWTL-HDESnu7sPu8sdhmcxqXtdEwPqykI7MCZ3DaV8nMvArgPlJA=s396-no?authuser=0`})
  }
}
