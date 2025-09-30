import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSharePageComponent } from './event-share-page.component';

describe('EventSharePageComponent', () => {
  let component: EventSharePageComponent;
  let fixture: ComponentFixture<EventSharePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSharePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSharePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
