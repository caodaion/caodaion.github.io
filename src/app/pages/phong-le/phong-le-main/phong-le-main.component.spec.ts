import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhongLeMainComponent } from './phong-le-main.component';

describe('PhongLeMainComponent', () => {
  let component: PhongLeMainComponent;
  let fixture: ComponentFixture<PhongLeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhongLeMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhongLeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
