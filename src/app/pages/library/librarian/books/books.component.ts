import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'librarian-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnChanges {

  gridForYouCols: number = 3
  forYouBooks = <any>[]
  @Output() onItemFocus = new EventEmitter()
  @Input() library: any;

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.gridForYouCols = 1
        } else {
          this.gridForYouCols = 3
        }
      });
  }

  ngOnChanges() {
    this.getBooks()
  }

  getBooks() {
    this.library?.library?.forEach((item: any) => {
      if (!item.isStatic && item.cover) {
        item.image = `https://lh3.google.com/u/0/d/${item?.cover}`
      }
      if (item?.author) {
        item.subtitle = item?.author
      }
    })
    this.getForYouBooks()
  }

  onCardClick(item: any) {
    this.onItemFocus.emit(item)
  }

  getForYouBooks() {
    this.forYouBooks = this.library?.library?.filter((item: any) => item?.published)?.sort((a: any, b: any) => a?.name < b?.name ? -1 : 1)
  }
}
