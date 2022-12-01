import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpContentCreatorToolbarComponent } from './cp-content-creator-toolbar.component';

describe('CpContentCreatorToolbarComponent', () => {
  let component: CpContentCreatorToolbarComponent;
  let fixture: ComponentFixture<CpContentCreatorToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpContentCreatorToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpContentCreatorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
