import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnChay } from './an-chay';

describe('AnChay', () => {
  let component: AnChay;
  let fixture: ComponentFixture<AnChay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnChay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnChay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
