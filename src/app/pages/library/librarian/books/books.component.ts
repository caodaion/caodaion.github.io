import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'librarian-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnChanges {

  gridForYouCols: number = 2
  forYouBooks = <any>[]
  @Output() onItemFocus = new EventEmitter()
  @Input() books: any;

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

  ngOnChanges() {
    this.getForYouBooks()
  }

  onCardClick(item: any) {
    this.onItemFocus.emit(item)
  }

  getForYouBooks() {
    this.forYouBooks = this.books
  }
}
