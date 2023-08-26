import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoanSoComponent } from './soan-so.component';

describe('SoanSoComponent', () => {
  let component: SoanSoComponent;
  let fixture: ComponentFixture<SoanSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoanSoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoanSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
