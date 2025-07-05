import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TacVuService } from 'src/app/shared/services/tac-vu/tac-vu.service';

@Component({
    selector: 'app-nghi-tiet',
    templateUrl: './nghi-tiet.component.html',
    styleUrls: ['./nghi-tiet.component.scss'],
    standalone: false
})
export class NghiTietComponent implements OnInit {

  nghiTietKey: any;
  fontSize: any = 16;
  nghiTiet: any;
  isShowGuide: boolean = false;
  isShowDescription: boolean = false;
  filteredNghiTiet = <any>{};
  nghiTietToggle: any = 'down';
  calendarType: string = 'lunar'; // Default to lunar calendar
  fontSizeRange = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

  constructor(
    private route: ActivatedRoute,
    private tacVuService: TacVuService,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['nghiTietKey']) {
        this.nghiTietKey = query['nghiTietKey']
        this.getNghiTiet()
      }
    })
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

  getNghiTiet() {
    this.tacVuService.getNghiTiet(this.nghiTietKey)
      .subscribe((res: any) => {
        if (res.data) {
          this.nghiTiet = res.data
          this.filterNghiTiet();
          this.cd.detectChanges()
        }
      })
  }

  filterNghiTiet() {
    this.filteredNghiTiet.steps = []
    this.filteredNghiTiet.steps = this.nghiTiet?.steps?.filter((item: any) => !item?.toggle || item?.toggle === this.nghiTietToggle)
    this.cd.detectChanges()
  }

  onCalendarTypeChange() {
    // Handle calendar type change logic here
    // You can add specific logic based on lunar or solar calendar selection
    console.log('Calendar type changed to:', this.calendarType);
    // Optionally re-filter or update data based on calendar type
    this.filterNghiTiet();
  }

  onPrint(printArea: any) {
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      '<html><head><title>' + document.title.toUpperCase() + ' PRINTER</title>'
    );
    printTab?.document.write('</head><body >');
    const printContent = printArea
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      // @ts-ignore
      writeContent.innerHTML = printContent?.outerHTML;
      // @ts-ignore
      writeContent.childNodes[0].style.padding = 0;
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }

  showGuide() {
    this.isShowGuide = true;
    setTimeout(() => {
      this.isShowGuide = false;
    }, 3000);
  }

}
