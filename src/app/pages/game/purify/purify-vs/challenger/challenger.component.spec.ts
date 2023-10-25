import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengerComponent } from './challenger.component';

describe('ChallengerComponent', () => {
  let component: ChallengerComponent;
  let fixture: ComponentFixture<ChallengerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengerComponent]
    });
    fixture = TestBed.createComponent(ChallengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
