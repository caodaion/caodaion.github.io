import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauSieuVoViListComponent } from './cau-sieu-vo-vi-list.component';

describe('CauSieuVoViListComponent', () => {
  let component: CauSieuVoViListComponent;
  let fixture: ComponentFixture<CauSieuVoViListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauSieuVoViListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauSieuVoViListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
