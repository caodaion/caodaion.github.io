import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapSoVanComponent } from './tap-so-van.component';

describe('TapSoVanComponent', () => {
  let component: TapSoVanComponent;
  let fixture: ComponentFixture<TapSoVanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TapSoVanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TapSoVanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
