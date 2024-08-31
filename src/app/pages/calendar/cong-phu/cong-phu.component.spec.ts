import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongPhuComponent } from './cong-phu.component';

describe('CongPhuComponent', () => {
  let component: CongPhuComponent;
  let fixture: ComponentFixture<CongPhuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CongPhuComponent]
    });
    fixture = TestBed.createComponent(CongPhuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
