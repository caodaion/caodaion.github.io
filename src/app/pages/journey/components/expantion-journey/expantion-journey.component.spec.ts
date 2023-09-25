import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpantionJourneyComponent } from './expantion-journey.component';

describe('ExpantionJourneyComponent', () => {
  let component: ExpantionJourneyComponent;
  let fixture: ComponentFixture<ExpantionJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpantionJourneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpantionJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
