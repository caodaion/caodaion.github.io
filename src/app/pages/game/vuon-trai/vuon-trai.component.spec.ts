import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuonTraiComponent } from './vuon-trai.component';

describe('VuonTraiComponent', () => {
  let component: VuonTraiComponent;
  let fixture: ComponentFixture<VuonTraiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VuonTraiComponent]
    });
    fixture = TestBed.createComponent(VuonTraiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
