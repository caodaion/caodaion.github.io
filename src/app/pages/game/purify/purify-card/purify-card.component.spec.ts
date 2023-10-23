import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurifyCardComponent } from './purify-card.component';

describe('PurifyCardComponent', () => {
  let component: PurifyCardComponent;
  let fixture: ComponentFixture<PurifyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurifyCardComponent]
    });
    fixture = TestBed.createComponent(PurifyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
