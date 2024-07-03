import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuongComponent } from './guong.component';

describe('GuongComponent', () => {
  let component: GuongComponent;
  let fixture: ComponentFixture<GuongComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuongComponent]
    });
    fixture = TestBed.createComponent(GuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
