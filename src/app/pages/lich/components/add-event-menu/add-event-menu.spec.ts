import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventMenu } from './add-event-menu';

describe('AddEventMenu', () => {
  let component: AddEventMenu;
  let fixture: ComponentFixture<AddEventMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
