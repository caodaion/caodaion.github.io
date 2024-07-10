import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bcd100Component } from './bcd100.component';

describe('Bcd100Component', () => {
  let component: Bcd100Component;
  let fixture: ComponentFixture<Bcd100Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Bcd100Component]
    });
    fixture = TestBed.createComponent(Bcd100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
