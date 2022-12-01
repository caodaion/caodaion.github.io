import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TnhtTableContentComponent } from './tnht-table-content.component';

describe('TnhtTableContentComponent', () => {
  let component: TnhtTableContentComponent;
  let fixture: ComponentFixture<TnhtTableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TnhtTableContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TnhtTableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
