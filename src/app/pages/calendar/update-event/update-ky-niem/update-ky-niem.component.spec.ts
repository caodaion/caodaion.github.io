import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKyNiemComponent } from './update-ky-niem.component';

describe('UpdateKyNiemComponent', () => {
  let component: UpdateKyNiemComponent;
  let fixture: ComponentFixture<UpdateKyNiemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateKyNiemComponent]
    });
    fixture = TestBed.createComponent(UpdateKyNiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
