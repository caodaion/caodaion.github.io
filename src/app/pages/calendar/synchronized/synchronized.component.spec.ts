import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizedComponent } from './synchronized.component';

describe('SynchronizedComponent', () => {
  let component: SynchronizedComponent;
  let fixture: ComponentFixture<SynchronizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SynchronizedComponent]
    });
    fixture = TestBed.createComponent(SynchronizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
