import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinhListComponent } from './kinh-list.component';

describe('KinhListComponent', () => {
  let component: KinhListComponent;
  let fixture: ComponentFixture<KinhListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KinhListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
