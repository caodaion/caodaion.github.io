import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuanCuuFormComponent } from './tuan-cuu-form.component';

describe('TuanCuuFormComponent', () => {
  let component: TuanCuuFormComponent;
  let fixture: ComponentFixture<TuanCuuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuanCuuFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuanCuuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
