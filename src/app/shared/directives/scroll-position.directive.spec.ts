import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScrollPositionDirective } from './scroll-position.directive';
import { ScrollManagerService } from '../services/scroll-manager/scroll-manager.service';

@Component({
  template: `<div appScrollPosition>Test Content</div>`,
  standalone: true,
  imports: [ScrollPositionDirective]
})
class TestComponent {}

describe('ScrollPositionDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockScrollManagerService: jasmine.SpyObj<ScrollManagerService>;

  beforeEach(async () => {
    const scrollManagerSpy = jasmine.createSpyObj('ScrollManagerService', [
      'saveCurrentScrollPosition'
    ]);

    await TestBed.configureTestingModule({
      imports: [TestComponent, ScrollPositionDirective],
      providers: [
        { provide: ScrollManagerService, useValue: scrollManagerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    mockScrollManagerService = TestBed.inject(ScrollManagerService) as jasmine.SpyObj<ScrollManagerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save scroll position on destroy', () => {
    fixture.destroy();
    expect(mockScrollManagerService.saveCurrentScrollPosition).toHaveBeenCalled();
  });
});