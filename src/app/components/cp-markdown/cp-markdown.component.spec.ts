import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpMarkdownComponent } from './cp-markdown.component';

describe('CpMarkdownComponent', () => {
  let component: CpMarkdownComponent;
  let fixture: ComponentFixture<CpMarkdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CpMarkdownComponent]
    });
    fixture = TestBed.createComponent(CpMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
