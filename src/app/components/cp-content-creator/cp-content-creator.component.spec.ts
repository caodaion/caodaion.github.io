import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpContentCreatorComponent } from './cp-content-creator.component';

describe('CpContentCreatorComponent', () => {
  let component: CpContentCreatorComponent;
  let fixture: ComponentFixture<CpContentCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpContentCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
