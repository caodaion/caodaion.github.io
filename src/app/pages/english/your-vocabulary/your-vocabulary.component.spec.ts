import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourVocabularyComponent } from './your-vocabulary.component';

describe('YourVocabularyComponent', () => {
  let component: YourVocabularyComponent;
  let fixture: ComponentFixture<YourVocabularyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YourVocabularyComponent]
    });
    fixture = TestBed.createComponent(YourVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
