import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuanCuuComponent } from './tuan-cuu.component';

describe('TuanCuuComponent', () => {
  let component: TuanCuuComponent;
  let fixture: ComponentFixture<TuanCuuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TuanCuuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuanCuuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
