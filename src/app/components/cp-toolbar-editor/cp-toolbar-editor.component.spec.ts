import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpToolbarEditorComponent } from './cp-toolbar-editor.component';

describe('CpToolbarEditorComponent', () => {
  let component: CpToolbarEditorComponent;
  let fixture: ComponentFixture<CpToolbarEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpToolbarEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpToolbarEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
