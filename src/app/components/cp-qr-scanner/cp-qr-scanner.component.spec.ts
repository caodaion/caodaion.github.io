import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpQrScannerComponent } from './cp-qr-scanner.component';

describe('CpQrScannerComponent', () => {
  let component: CpQrScannerComponent;
  let fixture: ComponentFixture<CpQrScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpQrScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpQrScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
