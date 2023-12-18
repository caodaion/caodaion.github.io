import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

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
    this.getBooks()
  }

  getBooks() {
    this.books.forEach((item: any) => {
      if (!item.isStatic) {
        item.image = `https://raw.githubusercontent.com/caodaion-library/caodaion-library.github.io/${!environment.production ? 'dev' : 'main'}/${item.key}/cover.png${!environment.production ? '?ref=dev' : ''}`
      }
    })
    this.getForYouBooks()
  }

  onCardClick(item: any) {
    this.onItemFocus.emit(item)
  }

  getForYouBooks() {
    this.forYouBooks = this.books?.filter((item: any) => item?.published)
    console.log(this.forYouBooks);
  }
}
