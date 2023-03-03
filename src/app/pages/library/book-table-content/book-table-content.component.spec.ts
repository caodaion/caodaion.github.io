import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTableContentComponent } from './book-table-content.component';

describe('BookTableContentComponent', () => {
  let component: BookTableContentComponent;
  let fixture: ComponentFixture<BookTableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookTableContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookTableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
