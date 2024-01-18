import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NghiTietComponent } from './nghi-tiet.component';

describe('NghiTietComponent', () => {
  let component: NghiTietComponent;
  let fixture: ComponentFixture<NghiTietComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NghiTietComponent]
    });
    fixture = TestBed.createComponent(NghiTietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
