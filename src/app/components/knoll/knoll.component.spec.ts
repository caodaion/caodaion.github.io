import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnollComponent } from './knoll.component';

describe('KnollComponent', () => {
  let component: KnollComponent;
  let fixture: ComponentFixture<KnollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
