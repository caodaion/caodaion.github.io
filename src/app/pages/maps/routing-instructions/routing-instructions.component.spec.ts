import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingInstructionsComponent } from './routing-instructions.component';

describe('RoutingInstructionsComponent', () => {
  let component: RoutingInstructionsComponent;
  let fixture: ComponentFixture<RoutingInstructionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoutingInstructionsComponent]
    });
    fixture = TestBed.createComponent(RoutingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
