import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNhan } from './ca-nhan';

describe('CaNhan', () => {
  let component: CaNhan;
  let fixture: ComponentFixture<CaNhan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaNhan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaNhan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
