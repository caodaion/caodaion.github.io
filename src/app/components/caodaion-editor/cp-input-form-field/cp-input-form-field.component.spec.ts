import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpFormFieldComponent } from './cp-input-form-field.component';

describe('CpFormFieldComponent', () => {
  let component: CpFormFieldComponent;
  let fixture: ComponentFixture<CpFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
