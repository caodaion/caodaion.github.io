import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoDaiONPWAContentEditorComponent } from './cp-content-editor.component';

describe('CaoDaiONPWAContentEditorComponent', () => {
  let component: CaoDaiONPWAContentEditorComponent;
  let fixture: ComponentFixture<CaoDaiONPWAContentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoDaiONPWAContentEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaoDaiONPWAContentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
