import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaiThuongYeuComponent } from './bai-thuong-yeu.component';

describe('BaiThuongYeuComponent', () => {
  let component: BaiThuongYeuComponent;
  let fixture: ComponentFixture<BaiThuongYeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaiThuongYeuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaiThuongYeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
