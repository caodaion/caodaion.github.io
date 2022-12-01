import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpNumberFormFieldComponent } from './cp-number-form-field.component';

describe('CpNumberFormFieldComponent', () => {
  let component: CpNumberFormFieldComponent;
  let fixture: ComponentFixture<CpNumberFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpNumberFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpNumberFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
