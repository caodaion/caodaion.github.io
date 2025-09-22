import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinhInformation } from './kinh-information';

describe('KinhInformation', () => {
  let component: KinhInformation;
  let fixture: ComponentFixture<KinhInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KinhInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KinhInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
