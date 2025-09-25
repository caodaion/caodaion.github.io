import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhanSu } from './nhan-su';

describe('NhanSu', () => {
  let component: NhanSu;
  let fixture: ComponentFixture<NhanSu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NhanSu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhanSu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
