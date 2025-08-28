import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildHeaderComponent } from './child-header.component';

describe('ChildHeaderComponent', () => {
  let component: ChildHeaderComponent;
  let fixture: ComponentFixture<ChildHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
