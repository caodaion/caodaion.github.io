import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaodaiVocabularyComponent } from './caodai-vocabulary.component';

describe('CaodaiVocabularyComponent', () => {
  let component: CaodaiVocabularyComponent;
  let fixture: ComponentFixture<CaodaiVocabularyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaodaiVocabularyComponent]
    });
    fixture = TestBed.createComponent(CaodaiVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
