import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HanhLeComponent } from './hanh-le.component';

describe('HanhLeComponent', () => {
  let component: HanhLeComponent;
  let fixture: ComponentFixture<HanhLeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HanhLeComponent]
    });
    fixture = TestBed.createComponent(HanhLeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
