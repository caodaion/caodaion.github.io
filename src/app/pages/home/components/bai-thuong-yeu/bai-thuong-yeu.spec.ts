import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaiThuongYeu } from './bai-thuong-yeu';

describe('BaiThuongYeu', () => {
  let component: BaiThuongYeu;
  let fixture: ComponentFixture<BaiThuongYeu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaiThuongYeu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaiThuongYeu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
