import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'librarian-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  gridForYouCols: number = 2
  @Output() onItemFocus = new EventEmitter()

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.gridForYouCols = 1
        } else {
          this.gridForYouCols = 2
        }
      });
  }

  onCardClick(item: any) {
    this.onItemFocus.emit(item)
  }
}
