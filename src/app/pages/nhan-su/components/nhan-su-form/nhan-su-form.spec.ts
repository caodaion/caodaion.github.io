import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhanSuForm } from './nhan-su-form';

describe('NhanSuForm', () => {
  let component: NhanSuForm;
  let fixture: ComponentFixture<NhanSuForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NhanSuForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhanSuForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
