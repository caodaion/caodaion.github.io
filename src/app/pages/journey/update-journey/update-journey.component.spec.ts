import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJourneyComponent } from './update-journey.component';

describe('UpdateJourneyComponent', () => {
  let component: UpdateJourneyComponent;
  let fixture: ComponentFixture<UpdateJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateJourneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
