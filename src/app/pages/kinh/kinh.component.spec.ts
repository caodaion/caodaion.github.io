import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinhComponent } from './kinh.component';

describe('KinhComponent', () => {
  let component: KinhComponent;
  let fixture: ComponentFixture<KinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KinhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
