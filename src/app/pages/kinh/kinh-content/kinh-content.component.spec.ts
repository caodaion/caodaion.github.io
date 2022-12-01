import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinhContentComponent } from './kinh-content.component';

describe('TnhtContentComponent', () => {
  let component: KinhContentComponent;
  let fixture: ComponentFixture<KinhContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KinhContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KinhContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
