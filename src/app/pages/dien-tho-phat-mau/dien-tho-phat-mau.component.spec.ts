import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DienThoPhatMauComponent } from './dien-tho-phat-mau.component';

describe('DienThoPhatMauComponent', () => {
  let component: DienThoPhatMauComponent;
  let fixture: ComponentFixture<DienThoPhatMauComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DienThoPhatMauComponent]
    });
    fixture = TestBed.createComponent(DienThoPhatMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
