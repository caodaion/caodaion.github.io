import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TnhtContentComponent } from './tnht-content.component';

describe('TnhtContentComponent', () => {
  let component: TnhtContentComponent;
  let fixture: ComponentFixture<TnhtContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TnhtContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TnhtContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
