import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishComponent } from './english.component';

describe('EnglishComponent', () => {
  let component: EnglishComponent;
  let fixture: ComponentFixture<EnglishComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnglishComponent]
    });
    fixture = TestBed.createComponent(EnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
