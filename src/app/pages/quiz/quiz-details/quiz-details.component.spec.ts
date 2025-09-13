import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDetailsComponent } from './quiz-details.component';

describe('QuizDetailsComponent', () => {
  let component: QuizDetailsComponent;
  let fixture: ComponentFixture<QuizDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
