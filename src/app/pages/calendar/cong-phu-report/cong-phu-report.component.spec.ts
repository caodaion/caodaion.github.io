import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongPhuReportComponent } from './cong-phu-report.component';

describe('CongPhuReportComponent', () => {
  let component: CongPhuReportComponent;
  let fixture: ComponentFixture<CongPhuReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CongPhuReportComponent]
    });
    fixture = TestBed.createComponent(CongPhuReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
