import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnActionContribute } from './learn-action-contribute';

describe('LearnActionContribute', () => {
  let component: LearnActionContribute;
  let fixture: ComponentFixture<LearnActionContribute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnActionContribute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnActionContribute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
