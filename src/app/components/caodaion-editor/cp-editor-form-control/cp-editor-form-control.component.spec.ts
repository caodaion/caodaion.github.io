import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpEditorFormControlComponent } from './cp-editor-form-control.component';

describe('CpEditorFormControlComponent', () => {
  let component: CpEditorFormControlComponent;
  let fixture: ComponentFixture<CpEditorFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpEditorFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpEditorFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
