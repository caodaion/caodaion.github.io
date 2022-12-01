import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSubTitleComponent } from './header-sub-title.component';

describe('HeaderSubTitleComponent', () => {
  let component: HeaderSubTitleComponent;
  let fixture: ComponentFixture<HeaderSubTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSubTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSubTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
