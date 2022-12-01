import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCreatorContentComponent } from './cp-creator-content.component';

describe('CpCreatorContentComponent', () => {
  let component: CpCreatorContentComponent;
  let fixture: ComponentFixture<CpCreatorContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpCreatorContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpCreatorContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
