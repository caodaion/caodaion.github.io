import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurifyDetailsComponent } from './purify-details.component';

describe('PurifyDetailsComponent', () => {
  let component: PurifyDetailsComponent;
  let fixture: ComponentFixture<PurifyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurifyDetailsComponent]
    });
    fixture = TestBed.createComponent(PurifyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
