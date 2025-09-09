import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorComponent } from './collector.component';

describe('CollectorComponent', () => {
  let component: CollectorComponent;
  let fixture: ComponentFixture<CollectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorComponent]
    });
    fixture = TestBed.createComponent(CollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
