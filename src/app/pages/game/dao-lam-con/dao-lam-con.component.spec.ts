import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaoLamConComponent } from './dao-lam-con.component';

describe('DaoLamConComponent', () => {
  let component: DaoLamConComponent;
  let fixture: ComponentFixture<DaoLamConComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaoLamConComponent]
    });
    fixture = TestBed.createComponent(DaoLamConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
