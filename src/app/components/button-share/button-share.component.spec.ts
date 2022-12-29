import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonShareComponent } from './button-share.component';

describe('ButtonShareComponent', () => {
  let component: ButtonShareComponent;
  let fixture: ComponentFixture<ButtonShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
