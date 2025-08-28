import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhTuanCuuComponent } from './tinh-tuan-cuu.component';

describe('TinhTuanCuuComponent', () => {
  let component: TinhTuanCuuComponent;
  let fixture: ComponentFixture<TinhTuanCuuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinhTuanCuuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TinhTuanCuuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
