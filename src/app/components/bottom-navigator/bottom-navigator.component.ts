import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-bottom-navigator',
    templateUrl: './bottom-navigator.component.html',
    styleUrls: ['./bottom-navigator.component.scss'],
    standalone: false
})
export class BottomNavigatorComponent implements OnInit {
  @Input() prev: any;
  @Input() next: any;
  @Output() then = new EventEmitter();
  isRequiredHide: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isRequiredHide = true;
        } else {
          this.isRequiredHide = false;
        }
      });
  }

  onNavigate(item?: any) {
    this.router
      .navigate([item?.navigate?.link], {
        queryParams: item?.navigate?.queryParams,
      })
      .then(() => {
        if (this.isRequiredHide) {
          localStorage.setItem(
            'currentLayout',
            JSON.stringify({
              isHideToolbar: true,
              isHideBottomNavBar: true,
            })
          );
        }
        this.then?.emit();
      });
  }
}
