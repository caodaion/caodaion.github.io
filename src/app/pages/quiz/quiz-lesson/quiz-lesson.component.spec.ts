import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizLessonComponent } from './quiz-lesson.component';

describe('QuizLessonComponent', () => {
  let component: QuizLessonComponent;
  let fixture: ComponentFixture<QuizLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizLessonComponent]
    });
    fixture = TestBed.createComponent(QuizLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
