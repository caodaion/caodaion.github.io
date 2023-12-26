import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoiKhuyenCanYeuComponent } from './loi-khuyen-can-yeu.component';

describe('LoiKhuyenCanYeuComponent', () => {
  let component: LoiKhuyenCanYeuComponent;
  let fixture: ComponentFixture<LoiKhuyenCanYeuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoiKhuyenCanYeuComponent]
    });
    fixture = TestBed.createComponent(LoiKhuyenCanYeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
