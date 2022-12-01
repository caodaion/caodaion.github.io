import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCreatorBlockToolbarComponent } from './cp-creator-block-toolbar.component';

describe('CpCreatorBlockToolbarComponent', () => {
  let component: CpCreatorBlockToolbarComponent;
  let fixture: ComponentFixture<CpCreatorBlockToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpCreatorBlockToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpCreatorBlockToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
