import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurifyVsComponent } from './purify-vs.component';

describe('PurifyVsComponent', () => {
  let component: PurifyVsComponent;
  let fixture: ComponentFixture<PurifyVsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurifyVsComponent]
    });
    fixture = TestBed.createComponent(PurifyVsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
