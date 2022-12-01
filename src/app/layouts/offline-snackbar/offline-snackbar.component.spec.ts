import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineSnackbarComponent } from './offline-snackbar.component';

describe('OfflineSnackbarComponent', () => {
  let component: OfflineSnackbarComponent;
  let fixture: ComponentFixture<OfflineSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
