import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTourMenu } from './app-tour-menu';

describe('AppTourMenu', () => {
  let component: AppTourMenu;
  let fixture: ComponentFixture<AppTourMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTourMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTourMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
