import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCreatorBlockComponent } from './cp-creator-block.component';

describe('CpCreatorBlockComponent', () => {
  let component: CpCreatorBlockComponent;
  let fixture: ComponentFixture<CpCreatorBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpCreatorBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpCreatorBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
