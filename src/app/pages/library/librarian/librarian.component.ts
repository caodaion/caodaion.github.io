import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrls: ['./librarian.component.scss']
})
export class LibrarianComponent implements OnInit {
  previewingItem: any;
  mode: any;
  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mode = 'over'
        } else {
          this.mode = 'side'
        }
      });
  }
}
