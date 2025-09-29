import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { NavigationService } from '../../shared/services/navigation.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Subscription } from 'rxjs';
import { IconComponent } from "../icon/icon.component";
@Component({
  selector: 'app-child-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, IconComponent],
  templateUrl: './child-header.component.html',
  styleUrls: ['./child-header.component.scss'],
})
export class ChildHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() path: string = '';
  @Input() hideNavigation: boolean = false;
  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .pipe(map((result) => result.matches))
        .subscribe((matches) => {
          if (matches) {
            this.navigationService.hideNavigation();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.navigationService.showNavigation();
  }

  onGoBack() {
    if (this.goBack.observers.length > 0) {
      this.goBack.emit();
      return;
    }
    const urlParts = window.location.pathname.split('/').filter((part) => part);
    if (this.path) {
      this.router.navigate([this.path]);
      return;
    }
    if (urlParts.length > 1) {
      urlParts.pop();
      this.router.navigate(['/' + urlParts.join('/')]);
    } else {
      const lastVisitedPage = localStorage.getItem('lastVisitedPage');
      if (lastVisitedPage) {
        this.router.navigate([lastVisitedPage]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
