import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSectionComponent } from './quiz-section.component';

describe('QuizSectionComponent', () => {
  let component: QuizSectionComponent;
  let fixture: ComponentFixture<QuizSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizSectionComponent]
    });
    fixture = TestBed.createComponent(QuizSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
