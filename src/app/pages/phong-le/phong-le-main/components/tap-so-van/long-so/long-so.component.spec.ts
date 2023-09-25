import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongSoComponent } from './long-so.component';

describe('LongSoComponent', () => {
  let component: LongSoComponent;
  let fixture: ComponentFixture<LongSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongSoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LongSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
