import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfettiAnimation } from './confetti-animation';

describe('ConfettiAnimation', () => {
  let component: ConfettiAnimation;
  let fixture: ComponentFixture<ConfettiAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfettiAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfettiAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
