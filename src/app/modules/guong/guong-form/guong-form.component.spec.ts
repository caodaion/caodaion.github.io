import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuongFormComponent } from './guong-form.component';

describe('GuongFormComponent', () => {
  let component: GuongFormComponent;
  let fixture: ComponentFixture<GuongFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuongFormComponent]
    });
    fixture = TestBed.createComponent(GuongFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
